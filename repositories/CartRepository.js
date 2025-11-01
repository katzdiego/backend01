import CartDAO from '../dao/CartDAO.js';

export default class CartRepository {
    constructor() {
        this.dao = new CartDAO();
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async create(data) {
        return await this.dao.create(data);
    }

    async update(cart) {
        return await this.dao.update(cart);
    }
}