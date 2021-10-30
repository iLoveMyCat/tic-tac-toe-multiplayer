let users = [];

function userJoin(id, nickname) {
  let user = {
    id: id,
    nickname: nickname,
    team: undefined,
    ready: false,
  };
  user = allocateTeam(user);

  if (users.some((u) => u.nickname === user.nickname)) {
    return false;
  }
  users.push(user);

  return user;
}

function userLeft(leftUser) {
  users = users.filter((user) => user.id !== leftUser.id);
  for (let i = 0; i < users.length; i++) {
    if (users[i].team === undefined) {
      users[i].team = leftUser.team;
      break;
    }
  }
  return users;
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function getAllUsers() {
  return users;
}
function userReady(id) {
  users.map((user) => {
    if (user.id === id) user.ready = true;
  });
}
function getTeam(id) {
  return users.filter((user) => user.id === id)[0].team;
}

function usersResetReady() {
  users.map((user) => (user.ready = false));
}

function allocateTeam(user) {
  let users = getAllUsers();
  if (users.filter((user) => user.team === false).length === 0) {
    user.team = false;
  }
  if (users.filter((user) => user.team === true).length === 0) {
    user.team = true;
  }
  return user;
}

module.exports = {
  userJoin,
  userLeft,
  getUser,
  getAllUsers,
  userReady,
  getTeam,
  usersResetReady,
};
