let users = [];

function userJoin(id){
    const user = {
        id: id,
        team: undefined,
        ready: false
    }
    switch(users.length){
        // team 'False - X' team 'True - O' and 'Spectator - undefined'
        case 0: user.team = false;
        break;
        case 1: user.team = true;
        break;
        default: user.team = undefined;
        break;
    }
    users.push(user);

    return user;
}

function userLeft(leftUser){
    users = users.filter(user => user.id !== leftUser.id);
    for(let i = 0; i<users.length; i++){
        if(users[i].team === undefined){ 
            users[i].team = leftUser.team; 
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
function userReady(id){
    users.map(user => {if(user.id === id) user.ready = true;})
}

module.exports = {
    userJoin,
    userLeft,
    getUser,
    getAllUsers,
    userReady
}