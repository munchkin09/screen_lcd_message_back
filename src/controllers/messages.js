const { buildMessagesController } = require(".");

let messages = {
    "pepe": "HOLA!" 
};

module.exports = {
    buildMessagesController: function(logger) {

        const messagesController = {
            setMessages,
            getMessage,
            
        };

        return messagesController;

        function setMessages(messagesToLoad) {
            logger.log(`MESSAGES LOADED: ${JSON.stringify(messagesToLoad, null, 4)}`);
            messages = messagesToLoad;
        }

        function getMessage(device) {

            let message;
            try {
                message = messages[device];
                messages[device] = "";
            } catch(error) {
                throw error;
            }

            return message;
        }
    }

}