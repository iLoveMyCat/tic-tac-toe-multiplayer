//Creating an http server
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

//set a static folder to serve
const path = require('path');
app.use(express.static(path.join(__dirname, "public")));

//Instance of socket.io
const io = require("socket.io")(server);

//users manager
const {getAllUsers, userJoin, userLeft, userReady, getTeam, usersResetReady} = require('./utils/users');
//game logic and referee
const { getGameState, isGameOver, startGame, move, isWinner, setWinner, endGame, getTurn } = require('./utils/game');


//'connection' - connection to the socket instance
io.on('connection', (socket) => {
        //'join server' - user loaded the page
        socket.on('join server', () => {
            const currentUser = userJoin(socket.id);
            socket.emit('user', currentUser);

            //broadcast gamestate upon join
            socket.emit('game state', {
                gameState: getGameState(),
                turn: getTurn()
            });
    
            //broadcast all users upon join
            io.emit('game users', {
                users: getAllUsers(),
            });
            
            //user disconnect - listener
            socket.on('disconnect', () => {
                //if disconnected user is a Player, reset game 
                if(currentUser.team === true || currentUser.team === false){
                    endGame();
                    io.emit('game state', {
                        gameState: getGameState(),
                        turn: getTurn()
                    });
                    io.emit('game over', "Player left the game, waiting for another player");
                }
                //userLeft returns new users array
                io.emit('game users', {users: userLeft(currentUser)});
            });
            
            //ready to play  - listener, if two players ready, start game otherwise wait
            socket.on('user ready', () => {
                userReady(currentUser.id);
                //check if both teams ready to play else emit a 'waiting' msg to this specific user.
                let users = getAllUsers();
                let userA = users.filter(user => user.team === false)[0];
                let userB = users.filter(user => user.team === true)[0];
                if(userA && userB && userA.ready && userB.ready){
                    io.emit('start game');
                    io.emit('game state', {
                        //startGame returns new gamestate
                        gameState: startGame(),
                        turn: getTurn()
                    });
                }
                else{
                    socket.emit('waiting', 'waiting for other players to get ready');
                }
            });
    
            socket.on('click',(clickedIdx)=>{
                //verify game is not over or clicked by a spectator
                if(!isGameOver() && getTeam(currentUser.id) !== undefined){
                    //move returns new gamestate array
                    if(move(clickedIdx, currentUser.team)){
                        io.emit('game state', {
                            gameState: getGameState(),
                            turn: getTurn()
                        });
                    }
                    //check if user won
                    if(isWinner(currentUser.team)){
                        setWinner(currentUser.team);
                        usersResetReady();
                        endGame();
                        io.emit('winner', {user: currentUser});
                    }    
                }
            });    
        });
});

//server listen on port
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});