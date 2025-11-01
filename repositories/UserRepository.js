const UserDAO = require('../dao/UserDAO');

class UserRepository {
  constructor() {
    this.dao = new UserDAO();
  }

  getByEmail(email) {
    return this.dao.getByEmail(email);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  create(data) {
    return this.dao.create(data);
  }

  updatePassword(id, newPassword) {
    return this.dao.updatePassword(id, newPassword);
  }
}

module.exports = UserRepository;