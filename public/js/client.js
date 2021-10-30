var socket = io();
var userList = document.getElementById("users");
var board = document.getElementById("board");
var feedback = document.getElementById("feedback");
var startBtn = document.getElementById("restart-btn");
var turnFeedback = document.getElementById("turn-feedback");
var teamFeedback = document.getElementById("team-feedback");
var connectionStatus = document.getElementById("connection-status");
var currentUser, currentTurn;
const { nickname } = Qs.parse(location.search, { ignoreQueryPrefix: true });

turnFeedback.style.display = "none";
setInterval(updateConnectionStatus, 1313);

socket.emit("join server", nickname, (user) => {
  currentUser = user;
});
function updateGameState(gameState, turn) {
  for (let i = 0; i < gameState.length; i++) {
    var tile = document.getElementById(i);
    if (gameState[i] === true) {
      tile.innerText = "X";
    }
    if (gameState[i] === false) {
      tile.innerText = "O";
    }
    if (gameState[i] === null) {
      tile.innerText = "";
    }
  }
  currentTurn = turn;
  if (currentTurn === currentUser.team) {
    turnFeedback.innerHTML = `Its Your Turn`;
  }
  if (currentTurn !== currentUser.team && currentUser.team !== undefined) {
    turnFeedback.innerHTML = `Opponents turn`;
  }
}

function updateConnectionStatus() {
  if (socket.connected) {
    connectionStatus.innerText = `connected`;
    connectionStatus.style.color = `green`;
  } else {
    connectionStatus.innerText = `disconnected`;
    connectionStatus.style.color = `red`;
  }
}

document.querySelectorAll(".cell").forEach((tile) => {
  tile.addEventListener("click", (event) => {
    socket.emit("click", event.target.id);
  });
});

//btn ready
startBtn.addEventListener("click", () => {
  socket.emit("user ready");
  startBtn.disabled = true;
  startBtn.innerText = "Ready";
});

//on game state listener
socket.on("game state", ({ gameState, turn }) => {
  updateGameState(gameState, turn);
});

function updateUserList(users) {
  userList.innerHTML = `
        ${users
          .map((user) => `<li>${user.nickname} team:${teamN(user.team)}</li>`)
          .join("")}
    `;
  if (
    users.find((user) => user.id === currentUser.id).team !== currentUser.team
  ) {
    currentUser.team = users.find((user) => user.id === currentUser.id).team;
  }
  if (currentUser.team === true) {
    teamFeedback.innerHTML = "you are X";
  }
  if (currentUser.team === false) {
    teamFeedback.innerHTML = "you are O";
  }
  if (currentUser.team === undefined) {
    teamFeedback.innerHTML = "you are a spectator";
  }
}

//on game users listener
socket.on("game users", ({ users }) => {
  updateUserList(users);
});

function teamN(t) {
  let team;
  if (t === true) {
    team = `X`;
  }
  if (t === false) {
    team = `O`;
  }
  if (t === undefined) {
    team = `Spectator`;
  }
  return team;
}

socket.on("start game", () => {
  feedback.innerHTML = `Game started!`;
  turnFeedback.innerHTML = `${currentUser.team ? `O` : `X`}`;
  turnFeedback.style.display = "block";
});

socket.on("waiting", (msg) => {
  console.log("waiting");
  feedback.innerHTML = msg;
});

socket.on("get ready", (msg) => {
  feedback.innerHTML = msg;
  startBtn.disabled = false;
  turnFeedback.innerHTML = " ";
  turnFeedback.style.display = "none";
});

socket.on("game over", (winner) => {
  let msg = "";
  if (winner === null) {
    msg = "It's a draw";
  } else {
    msg = winner === currentUser.team ? "You Won!" : "You Lost!";
  }
  feedback.innerHTML = msg;
  startBtn.innerText = "Play again?";
  startBtn.disabled = false;
  turnFeedback.innerHTML = " ";
  turnFeedback.style.display = "none";
});

socket.on("redirect", (destination) => {
  window.location.href = destination;
});
