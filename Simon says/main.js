const NOTES = ["C", "D", "E", "F", "G", "A", "B", "C2"];

let cards = [];
let sequence = [];
let playerStep = 0;
let currentLevel = 1;
let record = 0;
let gameActive = false;
let isShowing = false;

const cardsContainer = document.getElementById("cards");
const levelSpan = document.getElementById("level");
const recordSpan = document.getElementById("record");
const messageDiv = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

const sounds = {};

function loadSounds() {
  NOTES.forEach((note) => {
    sounds[note] = new Audio(`sounds/${note}.mp3`);
  });
}

function createCards() {
  cardsContainer.innerHTML = "";
  cards = [];

  NOTES.forEach((note, i) => {
    const key = document.createElement("div");
    key.className = "card";
    key.textContent = note;
    key.setAttribute("data-idx", i);

    key.addEventListener("click", () => onKeyClick(i));

    cardsContainer.appendChild(key);
    cards.push(key);
  });
}

function playSound(index) {
  const note = NOTES[index];
  const audio = sounds[note];

  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function highlightKey(index, active) {
  if (!cards[index]) return;

  if (active) {
    cards[index].classList.add("active");
    playSound(index);
  } else {
    cards[index].classList.remove("active");
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addRandomNote() {
  const random = Math.floor(Math.random() * NOTES.length);
  sequence.push(random);
}

async function showSequence() {
  isShowing = true;
  messageDiv.textContent = "Watch...";

  for (let i = 0; i < sequence.length; i++) {
    const idx = sequence[i];

    highlightKey(idx, true);
    await delay(500);

    highlightKey(idx, false);
    await delay(200);
  }

  isShowing = false;
  playerStep = 0;
  messageDiv.textContent = `Your turn (${sequence.length} notes)`;
}

async function nextRound() {
  addRandomNote();

  await delay(600);
  await showSequence();
}

function onKeyClick(index) {
  if (!gameActive || isShowing) return;

  highlightKey(index, true);
  setTimeout(() => highlightKey(index, false), 200);

  if (index !== sequence[playerStep]) {
    gameOver();
    return;
  }

  playerStep++;

  if (playerStep === sequence.length) {
    currentLevel++;
    levelSpan.textContent = currentLevel;

    setTimeout(() => {
      if (gameActive) nextRound();
    }, 800);
  }
}

function gameOver() {
  gameActive = false;

  if (currentLevel > record) {
    record = currentLevel;
    localStorage.setItem("record", record);
    recordSpan.textContent = record;
  }

  messageDiv.textContent = `Game Over! Level: ${currentLevel}`;
}

function startGame() {
  sequence = [];
  playerStep = 0;
  currentLevel = 1;
  levelSpan.textContent = currentLevel;

  gameActive = true;

  nextRound();
}

function init() {
  createCards();
  loadSounds();

  const saved = localStorage.getItem("record");
  if (saved) {
    record = parseInt(saved);
    recordSpan.textContent = record;
  }

  startBtn.addEventListener("click", startGame);
}

init();
