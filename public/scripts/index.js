const blahaj = document.getElementById("blahaj");
const countEl = document.getElementById("count");
let count = 0;

blahaj.addEventListener("click", () => {
    count++;
    countEl.textContent = count;

    let degree = (count - Math.floor(count / 45) * 45) * 8;
    console.log(blahaj.querySelector("div"))
    blahaj.querySelector("div").style.transform = `rotate(${degree}deg)`;

    blahaj.classList.remove("bump");
    void blahaj.offsetWidth;
    blahaj.classList.add("bump");
});
