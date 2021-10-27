
var socket = io();
socket.emit('join server');
var userList = document.getElementById('users');
var board = document.getElementById('board');
var feedback = document.getElementById('feedback');
var startBtn = document.getElementById('restart-btn');
var turnFeedback = document.getElementById('turn-feedback');
var teamFeedback = document.getElementById('team-feedback');
var currentUser, currentTurn;

turnFeedback.style.display = 'none';

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

//populate gamestate and turn
socket.on('game state', ({gameState, turn}) => {
    for(let i = 0; i<gameState.length;i++){  
        var tile = document.getElementById(i);
        if(gameState[i] === true){
            tile.innerText = 'X';
        }
        if(gameState[i] === false){
            tile.innerText = 'O';
        }
        if(gameState[i] === null){
            tile.innerText = '';
        }
    }
    currentTurn = turn;
    if(currentTurn === currentUser.team){
        turnFeedback.innerHTML = `Its Your Turn`;
    }
    if(currentTurn !== currentUser.team && currentUser.team !== undefined){
        turnFeedback.innerHTML = `Opponents turn`;
    }
});

//populate users on game users event
//update current user
socket.on('game users', ({users}) => {
    userList.innerHTML = `
        ${users.map(user => `<li>#${user.id} team:${user.team}</li>`).join('')}
    `;
    if(users.find(user => user.id === currentUser.id).team !== currentUser.team){
        currentUser.team = users.find(user => user.id === currentUser.id).team;
        console.log("now you are team: " + currentUser.team);
    }
    if(currentUser.team === true){
        teamFeedback.innerHTML = "you are X";
    }
    if(currentUser.team === false){
        teamFeedback.innerHTML = "you are O";
    }
    if(currentUser.team === undefined){
        teamFeedback.innerHTML = "you are a spectator";
    }
    
});

socket.on('user', (user) => {
    currentUser = user;
    console.log("you are team: " + currentUser.team);
});


socket.on('start game', () => {
    feedback.innerHTML = `Game started!`;
    turnFeedback.innerHTML = `${currentUser.team ? `O` : `X`}`;
    turnFeedback.style.display = 'block';
});

socket.on('waiting', (msg) => {
    console.log('waiting');
    feedback.innerHTML = msg;
});

socket.on('winner', ({user}) => {
    if(currentUser.team !== undefined){
        startBtn.disabled = false;
        startBtn.innerText = 'Play again?'
        turnFeedback.style.display = 'none';
        console.log(user.team);
        console.log(currentUser.team);
        
        feedback.innerHTML = `${user.team === currentUser.team? "You Won!" : "You Lost"}`;
    }
});

socket.on('game over', (msg) => {
    feedback.innerHTML = msg;
    startBtn.disabled = false;
    turnFeedback.innerHTML = " ";
    turnFeedback.style.display = 'none';
});