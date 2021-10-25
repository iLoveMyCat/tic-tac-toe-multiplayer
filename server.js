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

let users = [];

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);

    users.push(socket.id);
    io.emit('game users', users);

    socket.on('disconnect', () => {
        users = users.filter(e => e !== socket.id);
        io.emit('game users', users);
    });  
});


//server listen on port
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});