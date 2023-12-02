const sample = [
  {
    text: "Apixaban",
    color: "#ff7800",
    reaction: "a",
  },
  {
    text: "Rosuvastatin",
    color: "#ffd6ab",
    reaction: "b",
  },
  {
    text: "Company",
    color: "#ff7800",
    reaction: "c",
  },
  {
    text: "Apixaban",
    color: "#ffd6ab",
    reaction: "a",
  },
  {
    text: "Rosuvastatin",
    color: "#ff7800",
    reaction: "b",
  },
  {
    text: "Company",
    color: "#ffd6ab",
    reaction: "c",
  },
];

const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const ticker = wheel.querySelector(".ticker");
const trigger = document.querySelector("#btn-spin");
const spinClass = "is-spinning";
const selectedClass = "selected";
const spinnerStyles = window.getComputedStyle(spinner);
let prizeSlice = 360;
let prizeOffset = 180;
let sound = new Audio("/assets/sounds/ding.mp3");
let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;

const createPrizeNodes = (prizes) => {
  spinner.innerHTML = "";
  prizes.forEach(({ text, color, reaction }, i) => {
    const rotation = prizeSlice * i * -1 - prizeOffset;

    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize" data-text="${text}" data-color="${color}" data-reaction=${reaction} style="--rotate: ${rotation}deg">
        <span class="text">${text}</span>
      </li>`
    );
  });
};

const createConicGradient = (prizes) => {
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${prizes
        .map(
          ({ color }, i) =>
            `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`
        )
        .reverse()}
    );`
  );
};

const setupWheel = (prizes) => {
  prizeSlice = 360 / prizes.length;
  prizeOffset = Math.floor(180 / prizes.length)
  createConicGradient(prizes);
  createPrizeNodes(prizes);
  prizeNodes = wheel.querySelectorAll(".prize");
};

const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const runTickerAnimation = () => {
  // https://css-tricks.com/get-value-of-css-rotation-through-javascript/
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) rad += 2 * Math.PI;

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.style.animation = "none";
    setTimeout(() => (ticker.style.animation = null), 10);
    currentSlice = slice;
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }

  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const selectPrize = () => {
  const selected = Math.floor(rotation / prizeSlice);
  prizeNodes[selected].classList.add(selectedClass);

  document.querySelector(".pop-up-content-wrap span").innerHTML = prizeNodes[selected].getAttribute("data-text");
  document.querySelector(".custom-model-wrap").style.background = prizeNodes[selected].getAttribute("data-color");
  document.querySelector(".custom-model-main").classList.add('model-open');
};

trigger.addEventListener("click", () => {
//   if (reaper.dataset.reaction !== "resting") {
//     reaper.dataset.reaction = "resting";
//   }

  trigger.disabled = true;
  rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation();
});

spinner.addEventListener("transitionend", () => {
  cancelAnimationFrame(tickerAnim);
  trigger.disabled = false;
  trigger.focus();
  rotation %= 360;
  selectPrize();
  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);
});

document.querySelector(".custom-model-main").addEventListener("click", () => {
  document.querySelector(".custom-model-main").classList.remove('model-open');
});

setupWheel(sample);
