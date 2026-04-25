function filteredDeck() {
  if (document.getElementById("studyUnlearned").checked) {
    return deck.filter((c) => !c.learned);
  }

  return deck;
}

function addCard() {
  const frontInput = document.getElementById("frontInput");
  const backInput = document.getElementById("backInput");
  const addBtn = document.getElementById("addBtn");

  const front = frontInput.value.trim();
  const back = backInput.value.trim();

  if (!front || !back) return;

  if (editingId !== null) {
    const card = deck.find((c) => c.id === editingId);

    if (card) {
      card.front = front;
      card.back = back;
    }

    editingId = null;
    addBtn.innerText = "Add Card";
  } else {
    deck.push({
      id: Date.now(),
      front,
      back,
      learned: false,
    });
  }

  frontInput.value = "";
  backInput.value = "";
  render();
}

function deleteCard(id) {
  deck = deck.filter((c) => c.id !== id);
  render();
}

function editCard(id) {
  const card = deck.find((c) => c.id === id);
  if (!card) return;

  editingId = id;

  document.getElementById("frontInput").value = card.front;
  document.getElementById("backInput").value = card.back;

  const addBtn = document.getElementById("addBtn");
  addBtn.innerText = "Save Changes";
}

function toggleLearned(id) {
  const card = deck.find((c) => c.id === id);
  card.learned = !card.learned;
  render();
}

function shuffle() {
  deck.sort(() => Math.random() - 0.5);
  render();
}

function flipCard() {
  showFront = !showFront;
  renderCard();
}

function nextCard() {
  const cards = filteredDeck();

  if (currentIndex < cards.length - 1) {
    currentIndex++;
    showFront = true;
    renderCard();
  }
}

function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    showFront = true;
    renderCard();
  }
}

document.getElementById("addBtn").addEventListener("click", addCard);
document.getElementById("shuffleBtn").addEventListener("click", shuffle);
document.getElementById("prevBtn").addEventListener("click", prevCard);
document.getElementById("flipBtn").addEventListener("click", flipCard);
document.getElementById("nextBtn").addEventListener("click", nextCard);

document.getElementById("studyUnlearned").addEventListener("change", () => {
  currentIndex = 0;
  render();
});

render();
