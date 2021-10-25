let users = [];

function userJoin(id){
    const user = {
        id: id,
        team: ''
    }
    switch(users.length){
        // team 'X' team 'O' and 'Spectator'
        case 0: user.team = 'x';
        break;
        case 1: user.team = 'o';
        break;
        default: user.team = 's';
        break;
    }
    users.push(user);
}

function userLeft(id){
    let leftUsersTeam = getUser(id).team;
    users = users.filter(user => user.id !== id);
    for(let i = 0; i<users.length; i++){
        if(users[i].team === 's'){ 
            users[i].team = leftUsersTeam; 
            break;
        }
    }
}

function getUser(id){
    return users.find(user => user.id === id);
}

function getAllUsers(){
    return users;
}

module.exports = {
    userJoin,
    userLeft,
    getUser,
    getAllUsers
}