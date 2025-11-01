import Product from '../models/Product.js';

export default class ProductRepository {
    async getById(id) {
        return await Product.findById(id);
    }

    async getAll() {
        return await Product.find();
    }

    async create(data) {
        return await Product.create(data);
    }

    async update(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}