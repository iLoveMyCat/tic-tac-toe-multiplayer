const gameState = Array(9);
let gameOver = true;
let turn = false;

function startGame(){
    gameOver = false;
}

function restartGame(){
    gameState = Array(9);
    gameOver = false;
}

function isGameOver(){
    return gameOver;
}

function move(idx, team){
    if(isValidMove(idx)){
        gameState[idx] = team;
        turn = !turn;
    }
}

function getGameState(){
    return gameState;
}

function isValidMove(idx){
    if(((!turn && team === false) || (turn && team === true)) & gameState[idx] === undefined){
        return true;
    }
    return false;
}


module.exports = {
    getGameState,
    isGameOver,
    startGame
}