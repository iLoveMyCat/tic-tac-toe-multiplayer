var socket = io();
socket.emit('join server');


var userList = document.getElementById('users');
var board = document.getElementById('board');
var feedback = document.getElementById('feedback');
var startBtn = document.getElementById('restart-btn');

document.querySelectorAll('.cell').forEach(tile => {
    tile.addEventListener('click', event => {
        socket.emit('click', event.target.id);
    })
});

//btn ready
startBtn.addEventListener('click',()=>{
    socket.emit('user ready');
    startBtn.disabled = true;
    startBtn.innerText = "Ready";
});

//populate gamestate
socket.on('game state', ({gameState}) => {
    console.log(gameState)
    for(let i = 0; i<gameState.length;i++){  
        var tile = document.getElementById(i);
        tile.innerText = gameState[i];
    }
});

//populate users on game users event
socket.on('game users', ({users}) => {
    userList.innerHTML = `
        ${users.map(user => `<li>#${user.id} team:${user.team}</li>`).join('')}
    `;
});

//on start game
socket.on('start game', () => {
    console.log("game started");
});

//waiting
socket.on('waiting', () => {
    console.log("waiting for other player");
});