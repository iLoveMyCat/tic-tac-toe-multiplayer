let gameState = new Array(9);
let gameOver = true;
let turn = false;
let winner = undefined;
const winCombo = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8],
];

function startGame() {
  gameState = new Array(9);
  gameOver = false;
  return gameState;
}

function endGame() {
  gameState = new Array(9);
  gameOver = true;
  return gameState;
}

function isGameOver() {
  return gameOver;
}

function getGameState() {
  return gameState;
}

function getTurn() {
  return turn;
}

function move(idx, team) {
  if (isValidMove(idx, team)) {
    gameState[idx] = team;
    turn = !turn;
  }
  return gameState;
}

function isValidMove(idx, team) {
  if (
    ((!turn && team === false) || (turn && team === true)) &
    (gameState[idx] === undefined)
  ) {
    return true;
  }
  return false;
}

function isWinner(team) {
  let indexes = getAllIndexes(gameState, team);
  if (indexes.length >= 3) {
    for (let i = 0; i < winCombo.length; i++) {
      let win = false;
      for (let j = 0; j < winCombo[i].length; j++) {
        if (indexes.includes(winCombo[i][j])) {
          win = true;
        } else {
          win = false;
          break;
        }
      }

      if (win) {
        winner = team;
        return true;
      }
    }
  }
  return false;
}

function getAllIndexes(arr, val) {
  var indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

function isDraw() {
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === undefined) {
      return false;
    }
  }
  winner = undefined;
  return true;
}

function getWinner() {
  return winner;
}

module.exports = {
  getGameState,
  startGame,
  isGameOver,
  getTurn,
  move,
  isWinner,
  isDraw,
  endGame,
  getWinner,
};
