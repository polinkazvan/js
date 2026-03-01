let players = []
let currentPlayer = 0
let gameOver = false

const allcards=[1, 2 ,3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

function startGame() {

  let game = document.createElement("div")
  game.id="game"
  document.body.appendChild(game)

  document.getElementById("setup").style.display = "none"
  document.getElementById("rulse").style.display = "none"

  let count = parseInt(document.getElementById('playerCount').value)

  players = []
  for (let i = 0; i < count; i++) {
    players.push(allcards)
  }

  currentPlayer = 0
  gameOver = false

  renderLayout()
  renderCards()
  renderTurn()
}

function renderLayout(){

  let game = document.getElementById("game")
  game.innerHTML = ""

  for (let i = 0; i < players.length; i++) {

    let block = document.createElement("div")
    block.style.backgroundColor="#facafaff"
    block.style.borderRadius="1.5em"
    if (!i){
      block.style.backgroundColor="#fd6efd"
    }
    
   
    block.innerHTML = `
      <h2>Player ${i + 1} </h2>
      <div id="cards${i}" class="grid"> </div>
    `

    game.appendChild(block)
  }
}

function renderCards() {

  for (let p = 0; p < players.length; p++) { 

    let container = document.getElementById('cards' + p)
    container.innerHTML = ''

    for (let i = 1; i <= 12; i++) {

      let div = document.createElement('div')
      div.className = 'card'

      if (players[p].includes(i)) {
        div.innerText = i
      } else {
        div.innerText = ''
      }

      container.appendChild(div)
    }
  }
}

function renderTurn() {

  if (gameOver) return

  document.getElementById('turn').innerText =
      "Player " + (currentPlayer + 1) + " turn"

  let d1 = rollDice()
  let d2 = rollDice()

  let choice = document.getElementById('choice')
  choice.innerHTML = ''

  let b1 = document.createElement('button')
  b1.innerText = d1 + " , " + d2
  b1.onclick = () => removeCards([d1, d2])

  let b2 = document.createElement('button')
  b2.innerText = d1 + d2
  b2.onclick = () => removeCards([d1 + d2])

  let skip = document.createElement('button')
  skip.innerText = "skip"
  skip.onclick = nextPlayer

  choice.appendChild(b1)
  choice.appendChild(b2)
  choice.appendChild(skip)
}

function removeCards(numbers) {

  let playerCards = players[currentPlayer]

  for (let c of numbers) {
    if (!playerCards.includes(c)) {
      return
    }
  }

  players[currentPlayer] =
      playerCards.filter(c => !numbers.includes(c))

  renderCards()

  if (players[currentPlayer].length === 0) {
    showVictory()
    return
  }

  nextPlayer()
}

function nextPlayer() {

  document.querySelector(`#cards${currentPlayer}`).parentElement.style.backgroundColor="#facafaff"

  currentPlayer = (currentPlayer + 1) % players.length 

  document.querySelector(`#cards${currentPlayer}`).parentElement.style.backgroundColor="#fd6efd"
  renderTurn()
}

function showVictory() {
  gameOver = true

  document.getElementById('turn').innerHTML =
      `<div class="victory">
      Victory! Player ${currentPlayer + 1}! 
      </div>
       <button class="restart" onclick="restart()">restart</button>`

  document.getElementById('choice').innerHTML = ''
}

function restart() {
  document.getElementById("setup").style.display="block"
  document.getElementById("rulse").style.display="block"


players = []
currentPlayer = 0
gameOver = false

  
  document.querySelectorAll('.card').forEach(card => card.remove())
  document.querySelectorAll('h2').forEach(h2 => h2.remove())
  document.querySelectorAll('.victory').forEach(victory => victory.remove())
  document.querySelectorAll('.restart').forEach(restart => restart.remove()) 
  document.querySelectorAll('#game').forEach(game => game.remove()) 
} 

function rollDice() {
  return Math.floor(Math.random() * 6) + 1
}