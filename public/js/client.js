var socket = io();
socket.emit('join server');

var feedback = document.getElementById('feedback');
var userList = document.getElementById('users');

socket.on('game users', (users) => {
    console.log("game users", users);
    userList.innerHTML = `${users.map(user => `<li>${user}</li>`).join('')}`;
});


feedback.innerHTML = 'Connected...';