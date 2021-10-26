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
const { getGameState, isGameOver, startGame } = require('./utils/game');


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
            if(getAllUsers().filter(user => user.team === !currentUser.team)[0].ready === true){
                io.emit('start game');
                console.log("game started");
                startGame();
            }
            else{
                socket.emit('waiting');
            }
        });

        socket.on('click',(clickedIdx)=>{
            if(!isGameOver() && getTeam(currentUser.id) !== undefined){
                // testing, valid move to implement  
                console.log(`clicked ${clickedIdx}`);
                var gamestate = getGameState();
                gamestate[clickedIdx] = currentUser.team;
                console.log(gamestate);
                io.emit('game state', {gameState: gamestate});
            }
        });    
    });
});


//server listen on port
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});