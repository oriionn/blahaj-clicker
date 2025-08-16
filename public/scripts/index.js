const blahaj = document.getElementById("blahaj");
const error = document.getElementById("error");
const mode = document.getElementById("mode");
const countEl = document.getElementById("count");
const progress = document.getElementById("progress");
const goal = 1000000;
let init = true;
let count = 0;
let clickUUIDs = [];

let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (localStorage.getItem("theme")) {
    isDarkMode = localStorage.getItem("theme") === "dark";
}
updateTheme();

let ws;

function initWebsocket() {
    let ws_temp = new WebSocket("/websocket");
    ws_temp.addEventListener("message", (event) => {
        if (init) {
            error.textContent = "";
        }

        if (typeof event.data === "string") {
            if (event.data.startsWith("blahaj_")) {
                count = parseInt(event.data.split("_")[1]);
                let uuid = event.data.split("_")[2];
                if (!uuid) updateCount();
                updateCount(uuid);
            } else if (event.data === "spamhaj") {
                error.textContent = `Blahaj spam has been detected, please wait for the spam to subside.`;
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => {
                    error.textContent = "";
                }, 1000);
            } else if (event.data.startsWith("show_")) {
                let urlEncoded = event.data.split("_")[1];
                let url = atob(urlEncoded);
                document.body.style.background = `url(${url})`;
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundRepeat = "no-repeat";
                document.body.classList.add("dark");
            }
        }
    });

    ws_temp.addEventListener("close", (event) => {
        let err = "Connection to websocket lost, attempt to reconnect to websocket...";
        error.textContent = err;
        console.log(err);
        init = true;
        ws = initWebsocket();
    });

    return ws_temp;
}

ws = initWebsocket();
let timeout;

setInterval(() => ws.send("ping"), 30 * 1000)

blahaj.addEventListener("click", () => {
    count++;
    updateCount("1");

    let uuid = crypto.randomUUID();
    clickUUIDs.push(uuid);
    fetch(`/websocket/click`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uuid
        })
    });
});

mode.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    updateTheme();
});

function updateCount(uuid = "0") {
    countEl.textContent = count.toLocaleString("fr-FR");

    if (uuid === "0") return;
    if (clickUUIDs.includes(uuid)) {
        clickUUIDs = clickUUIDs.filter(u => u !== uuid);
        return;
    }

    let degree = (count - Math.floor(count / 45) * 45) * 8;
    blahaj.querySelector("div").style.transform = `rotate(${degree}deg)`;

    let percentage = Math.floor((count / goal) * 100);
    if (percentage >= 100) percentage = 100;
    progress.style.width = `${percentage}%`

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
