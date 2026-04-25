let deck = JSON.parse(localStorage.getItem("flashcards-deck") || "[]");

setInterval(
  () => localStorage.setItem("flashcards-deck", JSON.stringify(deck)),
  5000,
);

let currentIndex = 0;
let showFront = true;
let editingId = null;
