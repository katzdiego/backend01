import Ticket from '../models/Ticket.js';

export default class TicketRepository {
    async create(data) {
        return await Ticket.create(data);
    }

    async getById(id) {
        return await Ticket.findById(id).populate('purchaser').populate('products.product');
    }

    async getAll() {
        return await Ticket.find().populate('purchaser').populate('products.product');
    }
}