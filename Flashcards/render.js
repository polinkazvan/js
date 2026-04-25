function render() {
  renderTable();
  renderCard();
}

function renderCard() {
  const cards = filteredDeck();
  const cardDiv = document.getElementById("card");
  const positionDiv = document.getElementById("position");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (cards.length === 0) {
    cardDiv.innerText = "No cards";
    positionDiv.innerText = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  if (currentIndex >= cards.length) {
    currentIndex = Math.max(0, cards.length - 1);
  }

  const card = cards[currentIndex];
  cardDiv.innerText = showFront ? card.front : card.back;
  positionDiv.innerText = `${currentIndex + 1} / ${cards.length}`;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === cards.length - 1;
}

function renderTable() {
  const body = document.getElementById("tableBody");
  body.innerHTML = "";

  for (const card of deck) {
    const div = document.createElement("div");

    div.innerHTML = `
      <input type="checkbox" class="check" ${card.learned ? "checked" : ""}> 
      <span>${card.front} --- ${card.back}</span>
      <button class="delBtn">Delete</button>
      <button class="changBtn">Change</button>
      <br>
    `;

    const checkbox = div.querySelector(".check");
    checkbox.addEventListener("click", () => toggleLearned(card.id));

    const deleteBtn = div.querySelector(".delBtn");
    deleteBtn.addEventListener("click", () => deleteCard(card.id));

    const changeBtn = div.querySelector(".changBtn");
    changeBtn.addEventListener("click", () => editCard(card.id));

    body.appendChild(div);
  }
}
