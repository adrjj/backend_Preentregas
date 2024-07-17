
const TicketModel = require('../models/ticket.model');

class TicketDao {
    async createTicket(ticketData) {
        try {
            const ticket = await TicketModel.create(ticketData);
            return ticket;
        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }
}

module.exports = new TicketDao();
