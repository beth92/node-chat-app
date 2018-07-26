const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  let testUsers = new Users();

  beforeEach(() => {
    testUsers.users = [{
      id: 1,
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: 2,
      name: 'Sarah',
      room: 'React Course'
    }, {
      id: 3,
      name:'Beth',
      room: 'Node Course'
    }];
  });

  it('should add new user', () => {
    let users = new Users();
    const user = {
      id: 123,
      name: "Beth",
      room: "Partytime"
    };
    users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should fetch a user by ID', () => {
    expect(testUsers.getUser(1)).toEqual(testUsers.users[0]);
    expect(testUsers.getUser(2)).toEqual(testUsers.users[1]);
    expect(testUsers.getUser(3)).toEqual(testUsers.users[2]);
  });

  it('should return undefined when user not found', () => {
    expect(testUsers.getUser(4)).toNotExist();
  });

  it('should remove a user successfully when found', () => {
    expect(testUsers.removeUser(1).id).toBe(1);
    expect(testUsers.getUser(1)).toNotExist();
  });

  it('should be undefined when trying to remove non-existent user', () => {
    expect(testUsers.removeUser(4)).toNotExist();
  });

  it('should get list of users in a room', () => {
    expect(testUsers.getUsersInRoom('Node Course')).toEqual(['Mike', 'Beth']);
    expect(testUsers.getUsersInRoom('React Course')).toEqual(['Sarah']);
  });
});
