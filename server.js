//Creating an http server
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

//set a static folder to serve
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//Instance of socket.io
const io = require("socket.io")(server);

//users manager
const {
  getAllUsers,
  userJoin,
  userLeft,
  userReady,
  getTeam,
  usersResetReady,
} = require("./utils/users");

//game logic and referee
const {
  getGameState,
  isGameOver,
  startGame,
  move,
  isWinner,
  endGame,
  getTurn,
  isDraw,
  getWinner,
} = require("./utils/game");

//'connection' - connection to the socket instance
io.on("connection", (socket) => {
  //'join server' - user loaded the game page, callback clients user
  socket.on("join server", (nickname, callback) => {
    //redirect if can't create a user or nickname exists
    if (!nickname) {
      socket.emit("redirect", "/");
      return false;
    }
    const currentUser = userJoin(socket.id, nickname);
    if (!currentUser) {
      socket.emit("redirect", "/");
      return false;
    }
    callback(currentUser);

    //send the connected client its user object
    socket.emit("user", currentUser);

    if (currentUser.team !== undefined) {
      socket.broadcast.emit("get ready", "ready to play?");
    }

    //user disconnect - listener
    socket.on("disconnect", () => {
      //if disconnected user is a Player, reset game
      if (currentUser.team === true || currentUser.team === false) {
        usersResetReady();
        endGame();
        io.emit("game state", {
          gameState: getGameState(),
          turn: getTurn(),
        });
        io.emit("get ready", "waiting for another player");
      }
      //userLeft returns new users array
      io.emit("game users", { users: userLeft(currentUser) });
    });

    //broadcast gamestate upon join
    socket.emit("game state", {
      gameState: getGameState(),
      turn: getTurn(),
    });

    //broadcast all users upon join
    io.emit("game users", {
      users: getAllUsers(),
    });

    //ready to play  - listener, if two players ready, start game otherwise wait
    socket.on("user ready", () => {
      userReady(currentUser.id);
      //check if both teams ready to play else emit a 'waiting' msg to this specific user.
      let users = getAllUsers();
      let userA = users.filter((user) => user.team === false)[0];
      let userB = users.filter((user) => user.team === true)[0];
      if (userA && userB && userA.ready && userB.ready) {
        io.emit("start game");
        io.emit("game state", {
          //startGame returns new gamestate
          gameState: startGame(),
          turn: getTurn(),
        });
      } else {
        socket.emit("waiting", "waiting for another player");
        socket.broadcast.emit("get ready", "Your opponent is ready to play!");
      }
    });

    socket.on("click", (clickedIdx) => {
      //verify game is not over or clicked by a spectator
      if (!isGameOver() && getTeam(currentUser.id) !== undefined) {
        //move returns new gamestate array
        if (move(clickedIdx, currentUser.team)) {
          io.emit("game state", {
            gameState: getGameState(),
            turn: getTurn(),
          });
        }
        //check if user won or its a draw
        if (isWinner(currentUser.team) || isDraw()) {
          usersResetReady();
          endGame();
          io.emit("game over", getWinner());
        }
      }
    });
  });
});

//server listen on port
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
