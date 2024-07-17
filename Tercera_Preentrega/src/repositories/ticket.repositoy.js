
const TicketDao = require('../dao/ticketDao.js');

class TicketRepository {
    async createTicket(ticketData) {
        try {
            return await TicketDao.createTicket(ticketData);
        } catch (error) {
            throw new Error(`Error en el repositorio al crear el ticket: ${error.message}`);
        }
    }
}

module.exports = new TicketRepository();
