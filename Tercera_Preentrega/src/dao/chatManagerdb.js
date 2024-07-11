const ChatModel =require("../models/chat.model.js")

class ChatManager {
    constructor() {
        // Constructor si necesitas inicializar algo
    }

    async saveMessage(messageData) {
        try {
            const message = new ChatModel(messageData);
            await message.save();
            console.log("Mensaje guardado en MongoDB Atlas:", messageData);
        } catch (error) {
            console.error("Error al guardar el mensaje en MongoDB Atlas:", error);
            throw error;
        }
    }
}

module.exports = ChatManager;


