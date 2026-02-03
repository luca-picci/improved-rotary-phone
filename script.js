const countdownContainer = document.getElementById("countdown-container");
const questionContainer = document.getElementById("question-container");
const yesContainer = document.getElementById("yes-container");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");

// 14 febbraio ore 00:00 (timezone locale)
const targetDate = new Date(new Date().getFullYear(), 0, 14, 0, 0, 0);

// Aggiorna countdown
function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdownContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    return;
  }

  daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  hoursEl.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutesEl.textContent = Math.floor((diff / (1000 * 60)) % 60);
  secondsEl.textContent = Math.floor((diff / 1000) % 60);
}

setInterval(updateCountdown, 1000);
updateCountdown();

// NO che scappa
function moveNo() {
  const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
  const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

noBtn.addEventListener("mouseover", moveNo); // desktop
noBtn.addEventListener("touchstart", moveNo); // mobile

// SÌ con vibrazione e cuori esplosivi
yesBtn.addEventListener("click", () => {
  if (navigator.vibrate) {
    navigator.vibrate([300, 150, 300, 150, 500]);
  }
  questionContainer.classList.add("hidden");
  yesContainer.classList.remove("hidden");

  // Cuori esplosivi
  for (let i = 0; i < 30; i++) {
    const heart = document.createElement("span");
    heart.textContent = "❤️";
    heart.style.position = "fixed";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.top = Math.random() * window.innerHeight + "px";
    heart.style.fontSize = `${10 + Math.random() * 30}px`;
    heart.style.opacity = 0.9;
    heart.style.transition = "all 1s ease-out";
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * -200}px) scale(1.5)`;
      heart.style.opacity = 0;
    }, 10);

    setTimeout(() => heart.remove(), 1100);
  }
});

// Cuori fluttuanti continuo
const heartsContainer = document.querySelector(".hearts");
setInterval(() => {
  const heart = document.createElement("span");
  heart.textContent = "❤️";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 5 + Math.random() * 5 + "s";
  heartsContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 10000);
}, 500);
