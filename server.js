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
const {getAllUsers, userJoin, userLeft} = require('./utils/userManager');

//on connecting to the socket instance
io.on('connection', (socket) => {
    socket.on('join server', ()=> {
        userJoin(socket.id);
        //broadcasting the users array to all clients upon a new connection
        io.emit('game users', {
            users: getAllUsers()
        });
    
        //broadcasting the users array to all clients upon a disconnection
        socket.on('disconnect', () => {
            userLeft(socket.id);
            io.emit('game users', {users: getAllUsers()});
        });
    });
});


//server listen on port
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});