let gameState = Array(9);
let gameOver = true;
let turn = false;
let winner = undefined;
const winCombo = [[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,4,6],[2,5,8],[3,4,5]]; 

function startGame(){
    gameOver = false;
    gameState = Array(9);
}

function restartGame(){
    gameState = Array(9);
    gameOver = false;
}

function setGameOver(over){
    gameOver = over;
}

function isGameOver(){
    return gameOver;
}

function move(idx, team){
    if(isValidMove(idx, team)){
        gameState[idx] = team;
        turn = !turn;
    }
    return gameState;
}

function getGameState(){
    return gameState;
}

function isValidMove(idx, team){
    if(((!turn && team === false) || (turn && team === true)) & gameState[idx] === undefined){
        return true;
    }
    return false;
}

function isWinner(team){
    let indexes = getAllIndexes(gameState, team);
    if(indexes.length >= 3){
        for(let i = 0; i < winCombo.length; i++){
            let win = false;
            for(let j = 0; j < indexes.length; j++){
                if(winCombo[i].includes(indexes[j])){
                    win = true;
                }
                else{
                    win = false;
                    break;
                }
            }
            
            if(win){
                return true;
            }
        }
    }

    return false;
}

function setWinner(team){
    winner = team;
}

function getWinner(){
    return winner;
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

module.exports = {
    getGameState,
    isGameOver,
    setGameOver,
    startGame,
    move,
    isWinner,
    setWinner,
    restartGame,
}