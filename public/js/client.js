var socket = io();
socket.emit('join server');

var userList = document.getElementById('users');

//populate users on game users event
socket.on('game users', ({users}) => {
    userList.innerHTML = `
        ${users.map(user => `<li>#${user.id} team:${user.team}</li>`).join('')}
    `;
});

