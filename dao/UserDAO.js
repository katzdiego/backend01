const User = require('../models/User');

class UserDAO {
  async getByEmail(email) {
    return await User.findOne({ email });
  }

  async getById(id) {
    return await User.findById(id);
  }

  async create(data) {
    return await User.create(data);
  }

  async updatePassword(id, newPassword) {
    return await User.findByIdAndUpdate(id, { password: newPassword });
  }
}

module.exports = UserDAO;
