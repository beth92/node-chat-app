// [{
//   "id": '23456789',
//   "name": "Beth",
//   "room": "Rugby"
// }]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    const user = {
      name,
      id,
      room
    }
    this.users.push(user);
    return user;
  }

  removeUser (id) {
    const userToRemove = this.getUser(id);
    this.users = this.users.filter(user => user.id !== id);
    return userToRemove;
  }

  getUser (id) {
    // if more than one ID is matched (which shouldn't happen), return the first
    return this.users.filter(user => user.id === id)[0];
  }

  getUsersInRoom (room) {
    return this.users.filter(user => user.room === room).map(user => user.name);
  }
}

module.exports = {
  Users
}
