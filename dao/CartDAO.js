const Cart = require('../models/Cart');

class CartDAO {
  async getById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async update(cart) {
    return await Cart.findByIdAndUpdate(cart._id, cart, { new: true });
  }
}

module.exports = CartDAO;
