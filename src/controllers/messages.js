
module.exports = {
    buildMessagesController: (logger, messagesRepository) => {

        return {
            setMessage: insert,
            getMessages: read,
            deleteMessages
        };

        async function insert(message) {
            logger.log(`New message to broadcast: ${JSON.stringify(message, null, 4)}`);
            await messagesRepository.createWith(message);
        }

        async function read(device) {
            let messages;
            try {
                messages = await messagesRepository.readMessagesFor(device);
            } catch(error) {
                throw error;
            }
            return messages;
        }

        async function deleteMessages(device) {
            try {
                await messagesRepository.deleteMessagesFor(device);
            } catch(error) {
                throw error;
            }
        }
    }

}