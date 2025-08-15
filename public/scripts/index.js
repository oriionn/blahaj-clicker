const blahaj = document.getElementById("blahaj");
const error = document.getElementById("error");
const mode = document.getElementById("mode");
const countEl = document.getElementById("count");
let init = true;
let count = 0;

let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (localStorage.getItem("theme")) {
    isDarkMode = localStorage.getItem("theme") === "dark";
}
updateTheme();

const ws = new WebSocket("/websocket");
let timeout;

setInterval(() => ws.send("ping"), 30 * 1000)

blahaj.addEventListener("click", () => {
    ws.send("click");
});

mode.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    updateTheme();
});

ws.addEventListener("message", (event) => {
    if (typeof event.data === "string") {
        if (event.data.startsWith("blahaj_")) {
            count = parseInt(event.data.split("_")[1]);
            updateCount();
        } else if (event.data === "spamhaj") {
            error.textContent = `Blahaj spam has been detected, please wait for the spam to subside.`;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                error.textContent = "";
            }, 1000);
        }
    }
});

function updateCount() {
    countEl.textContent = count;

    let degree = (count - Math.floor(count / 45) * 45) * 8;
    blahaj.querySelector("div").style.transform = `rotate(${degree}deg)`;

    if (init) {
        init = false;
    } else {
        blahaj.classList.remove("bump");
        void blahaj.offsetWidth;
        blahaj.classList.add("bump");
    }
}

function updateTheme() {
    localStorage.setItem("theme", isDarkMode ? "dark":"light");
    if (isDarkMode) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}
