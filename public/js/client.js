var socket = io();
var userList = document.getElementById("users");
var board = document.getElementById("board");
var feedback = document.getElementById("feedback");
var startBtn = document.getElementById("restart-btn");
var turnFeedback = document.getElementById("turn-feedback");
var teamFeedback = document.getElementById("team-feedback");
var connectionStatus = document.getElementById("connection-status");
var usersHeader = document.getElementById("users-header");
var userLst = document.getElementById("users");
var currentUser, currentTurn;
const { nickname } = Qs.parse(location.search, { ignoreQueryPrefix: true });

usersHeader.addEventListener("click", () => {
  if (!userLst.style.visibility || userLst.style.visibility === "hidden") {
    userLst.style.visibility = "visible";
  } else {
    userLst.style.visibility = "hidden";
  }
});

turnFeedback.style.visibility = "hidden";
setInterval(updateConnectionStatus, 1313);

socket.emit("join server", nickname, (user) => {
  currentUser = user;
});
function updateGameState(gameState, turn) {
  for (let i = 0; i < gameState.length; i++) {
    var tile = document.getElementById(i);
    if (gameState[i] === true) {
      tile.innerHTML = "<p>&#x2B55</p>";
    }
    if (gameState[i] === false) {
      tile.innerHTML = "<p>&#x274c</p>";
    }
    if (gameState[i] === null) {
      tile.innerHTML = "";
    }
  }
  currentTurn = turn;
  if (currentTurn === currentUser.team) {
    turnFeedback.innerHTML = `Its Your Turn &#x1F447`;
  }
  if (currentTurn !== currentUser.team && currentUser.team !== undefined) {
    turnFeedback.innerHTML = `Opponents turn &#x270b`;
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
          .map((user) => `<li>${user.nickname} - ${teamN(user.team)}</li>`)
          .join("")}
    `;
  if (
    users.find((user) => user.id === currentUser.id).team !== currentUser.team
  ) {
    currentUser.team = users.find((user) => user.id === currentUser.id).team;
  }
  if (currentUser.team === true) {
    teamFeedback.innerHTML = `${currentUser.nickname} - &#x2B55`;
  }
  if (currentUser.team === false) {
    teamFeedback.innerHTML = `${currentUser.nickname} - &#x274c`;
  }
  if (currentUser.team === undefined) {
    teamFeedback.innerHTML = `${currentUser.nickname} - &#x1F440`;
  }
  usersHeader.innerHTML = `<p>&#x1F465x${users.length}</p>`;
}

//on game users listener
socket.on("game users", ({ users }) => {
  updateUserList(users);
});

function teamN(t) {
  let team;
  if (t === true) {
    team = `&#x2B55`;
  }
  if (t === false) {
    team = `&#x274c`;
  }
  if (t === undefined) {
    team = `&#x1F440`;
  }
  return team;
}

socket.on("start game", () => {
  feedback.innerHTML = `Game started! &#x1F44f`;
  turnFeedback.innerHTML = `${currentUser.team ? `&#x2B55` : `&#x274c`}`;
  turnFeedback.style.visibility = "visible";
});

socket.on("waiting", (msg) => {
  feedback.innerHTML = msg += "&#x231b";
});

socket.on("get ready", (msg) => {
  feedback.innerHTML = msg;
  turnFeedback.style.visibility = "hidden";
  startBtn.disabled = false;
});

socket.on("game over", (winner) => {
  let msg = "";
  if (winner === null) {
    msg = "It's a draw";
  } else {
    msg =
      winner === currentUser.team ? "You Won! &#x1F389" : "You Lost! &#x1F595";
  }
  feedback.innerHTML = msg;
  startBtn.innerHTML = "Play again?";
  startBtn.disabled = false;
  turnFeedback.innerHTML = " ";
  turnFeedback.style.visibility = "hidden";
});

socket.on("redirect", (destination) => {
  window.location.href = destination;
});
