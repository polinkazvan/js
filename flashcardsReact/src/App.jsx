import React from "react";
import "./App.css";

class App extends React.Component {
  state = {
    decks: [],
    activeDeckId: null,
    newDeckName: "",
    frontInp: "",
    backInp: "",
    showOnlyUnlearned: false,
    isFlipped: false,
    cardStudyIndex: 0,
    editingCardId: null,
    editFrontInp: "",
    editBackInp: "",
  };

  componentDidMount() {
    const saved = localStorage.getItem("flashcards-app");
    if (saved) {
      this.setState({ decks: JSON.parse(saved) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.decks !== this.state.decks) {
      localStorage.setItem("flashcards-app", JSON.stringify(this.state.decks));
    }
  }

  updateNewDeckName = (e) => this.setState({ newDeckName: e.target.value });
  updateFrontText = (e) => this.setState({ frontInp: e.target.value });
  updateBackText = (e) => this.setState({ backInp: e.target.value });

  addDeck = () => {
    if (!this.state.newDeckName.trim()) return;
    const newDeck = { id: Date.now(), name: this.state.newDeckName, cards: [] };
    this.setState((prevState) => ({
      decks: [...prevState.decks, newDeck],
      newDeckName: "",
    }));
  };

  removeDeck = (id) => {
    this.setState((prevState) => {
      const updatedDecks = prevState.decks.filter((d) => d.id !== id);
      const newActiveDeckId =
        prevState.activeDeckId === id ? null : prevState.activeDeckId;
      return { decks: updatedDecks, activeDeckId: newActiveDeckId };
    });
  };

  selectDeck = (id) => {
    this.setState({
      activeDeckId: id,
      cardStudyIndex: 0,
      isFlipped: false,
      showOnlyUnlearned: false,
      editingCardId: null,
    });
  };

  addCard = () => {
    const { activeDeckId, frontInp, backInp } = this.state;
    if (!activeDeckId || !frontInp.trim() || !backInp.trim()) return;

    const newCard = {
      id: Date.now(),
      frontSide: frontInp,
      backSide: backInp,
      learned: false,
    };

    this.setState((prevState) => ({
      decks: prevState.decks.map((deck) =>
        deck.id === activeDeckId
          ? { ...deck, cards: [...deck.cards, newCard] }
          : deck,
      ),
      frontInp: "",
      backInp: "",
    }));
  };

  removeCard = (cardId) => {
    this.setState((prevState) => {
      const newDecks = prevState.decks.map((deck) =>
        deck.id === prevState.activeDeckId
          ? { ...deck, cards: deck.cards.filter((c) => c.id !== cardId) }
          : deck,
      );
      const newIndex = Math.max(0, prevState.cardStudyIndex - 1);
      return { decks: newDecks, cardStudyIndex: newIndex, isFlipped: false };
    });
  };

  toggleCardLearned = (cardId) => {
    this.setState((prevState) => {
      const newDecks = prevState.decks.map((deck) =>
        deck.id === prevState.activeDeckId
          ? {
              ...deck,
              cards: deck.cards.map((c) =>
                c.id === cardId ? { ...c, learned: !c.learned } : c,
              ),
            }
          : deck,
      );
      const newIndex = Math.max(0, prevState.cardStudyIndex - 1);

      return {
        decks: newDecks,
        cardStudyIndex: prevState.showOnlyUnlearned
          ? newIndex
          : prevState.cardStudyIndex,
        isFlipped: false,
      };
    });
  };

  startEditing = (card) => {
    this.setState({
      editingCardId: card.id,
      editFrontInp: card.frontSide,
      editBackInp: card.backSide,
    });
  };

  saveEdit = () => {
    const { activeDeckId, editingCardId, editFrontInp, editBackInp } =
      this.state;
    if (!editFrontInp.trim() || !editBackInp.trim()) return;

    this.setState((prevState) => ({
      decks: prevState.decks.map((deck) =>
        deck.id === activeDeckId
          ? {
              ...deck,
              cards: deck.cards.map((c) =>
                c.id === editingCardId
                  ? { ...c, frontSide: editFrontInp, backSide: editBackInp }
                  : c,
              ),
            }
          : deck,
      ),
      editingCardId: null,
    }));
  };

  shuffleCards = () => {
    this.setState((prevState) => {
      const newDecks = prevState.decks.map((deck) => {
        if (deck.id === prevState.activeDeckId) {
          const shuffledCards = [...deck.cards].sort(() => Math.random() - 0.5);
          return { ...deck, cards: shuffledCards };
        }
        return deck;
      });
      return { decks: newDecks, cardStudyIndex: 0, isFlipped: false };
    });
  };

  render() {
    const {
      decks,
      activeDeckId,
      cardStudyIndex,
      isFlipped,
      showOnlyUnlearned,
      editingCardId,
      editFrontInp,
      editBackInp,
    } = this.state;

    const activeDeck = decks.find((d) => d.id === activeDeckId);
    const filteredCards = activeDeck
      ? showOnlyUnlearned
        ? activeDeck.cards.filter((c) => !c.learned)
        : activeDeck.cards
      : [];
    const currentCard = filteredCards[cardStudyIndex] || null;

    return (
      <div id="main">
        <h1>Create deck</h1>
        <input
          type="text"
          value={this.state.newDeckName}
          onChange={this.updateNewDeckName}
          placeholder="New deck name"
        />
        <button id="addDeckBtn" onClick={this.addDeck}>
          Add deck
        </button>

        <h1>Choose deck</h1>
        <div id="deckContainer">
          {decks.map((d) => (
            <React.Fragment key={d.id}>
              <button
                className={`deck-name-btn ${d.id === activeDeckId ? "active-deck" : ""}`}
                onClick={() => this.selectDeck(d.id)}
              >
                {d.name}
              </button>
              <button
                className="delete-deck-btn"
                onClick={() => this.removeDeck(d.id)}
              >
                delete
              </button>
            </React.Fragment>
          ))}
        </div>

        {activeDeck && (
          <>
            <div className="card-adder-row">
              <div id="ChoosenText">Chosen deck: {activeDeck.name}</div>
              <input
                type="text"
                placeholder="Front"
                value={this.state.frontInp}
                onChange={this.updateFrontText}
              />
              <input
                type="text"
                placeholder="Back"
                value={this.state.backInp}
                onChange={this.updateBackText}
              />
            </div>
            <button id="addCardBtn" onClick={this.addCard}>
              Add card
            </button>

            <div id="cardContainer">
              {activeDeck.cards.map((c) => (
                <div className="card-item" key={c.id}>
                  {editingCardId === c.id ? (
                    <div className="card-edit-mode">
                      <input
                        type="text"
                        value={editFrontInp}
                        onChange={(e) =>
                          this.setState({ editFrontInp: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        value={editBackInp}
                        onChange={(e) =>
                          this.setState({ editBackInp: e.target.value })
                        }
                      />
                      <button
                        className="mini-btn save-green"
                        onClick={this.saveEdit}
                      >
                        Save
                      </button>
                      <button
                        className="mini-btn"
                        onClick={() => this.setState({ editingCardId: null })}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        checked={c.learned}
                        onChange={() => this.toggleCardLearned(c.id)}
                      />
                      <div className="card-info">
                        {c.frontSide} - {c.backSide}
                      </div>
                      <div className="card-actions">
                        <button
                          className="mini-btn"
                          onClick={() => this.startEditing(c)}
                        >
                          Edit
                        </button>
                        <button
                          className="mini-btn del-red"
                          onClick={() => this.removeCard(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div id="learned">
              <input
                type="checkbox"
                checked={showOnlyUnlearned}
                onChange={() =>
                  this.setState({
                    showOnlyUnlearned: !showOnlyUnlearned,
                    cardStudyIndex: 0,
                    isFlipped: false,
                  })
                }
              />
              <label>Only not learned</label>
            </div>

            <button
              id="cardBtn"
              className="study-card"
              onClick={() => this.setState({ isFlipped: !isFlipped })}
              disabled={!currentCard}
            >
              {currentCard
                ? isFlipped
                  ? currentCard.backSide
                  : currentCard.frontSide
                : "No cards"}
            </button>

            <div id="ctrlBtns">
              <button
                className={`btn-nav ${cardStudyIndex > 0 ? "active" : ""}`}
                onClick={() =>
                  this.setState({
                    cardStudyIndex: cardStudyIndex - 1,
                    isFlipped: false,
                  })
                }
                disabled={cardStudyIndex <= 0}
              >
                Back
              </button>
              <button
                className="btn-nav active"
                onClick={this.shuffleCards}
                disabled={filteredCards.length < 2}
              >
                Shuffle
              </button>
              <button
                className={`btn-nav ${cardStudyIndex < filteredCards.length - 1 ? "active" : ""}`}
                onClick={() =>
                  this.setState({
                    cardStudyIndex: cardStudyIndex + 1,
                    isFlipped: false,
                  })
                }
                disabled={
                  cardStudyIndex >= filteredCards.length - 1 ||
                  filteredCards.length === 0
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default App;
