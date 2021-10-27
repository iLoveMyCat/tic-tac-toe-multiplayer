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
const { Server } = require("socket.io");
const io = new Server(server);

//users manager
const {getAllUsers, userJoin, userLeft, userReady, getTeam} = require('./utils/users');
//game logic and referee
const { getGameState, isGameOver, startGame, move} = require('./utils/game');


//on connecting to the socket instance
io.on('connection', (socket) => {
    socket.on('join server', ()=> {
        const currentUser = userJoin(socket.id);

        //broadcast gamestate upon join
        socket.emit('game state', {
            gameState: getGameState()
        });

        //broadcast the users array to all clients upon a new connection
        io.emit('game users', {
            users: getAllUsers()
        });
        
        //broadcasting the users array to all clients upon a disconnection
        socket.on('disconnect', () => {
            userLeft(currentUser);
            io.emit('game users', {users: getAllUsers()});
        });

        //on two players ready broadcast start game otherwise wait
        socket.on('user ready', () => {
            userReady(currentUser.id);

            //check if both teams ready to play
            let users = getAllUsers();
            let userA = users.filter(user => user.team === false)[0];
            let userB = users.filter(user => user.team === true)[0];
            if(userA && userB && userA.ready && userB.ready){
                io.emit('start game');
                console.log("game started");
                startGame();
            }
            else{
                socket.emit('waiting');
            }
        });

        socket.on('click',(clickedIdx)=>{
            //verify game is not over and not clicked by a spectator
            if(!isGameOver() && getTeam(currentUser.id) !== undefined){
                    var gamestate = move(clickedIdx, getTeam(currentUser.id));
                    if(gamestate){
                        io.emit('game state', {gameState: gamestate});
                    }
            }
        });    
    });
});


//server listen on port
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});