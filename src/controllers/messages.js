
module.exports = {
    buildMessagesController: (logger, messagesRepository) => {

        return {
            setMessage: insert,
            getMessages: read
        };

        async function insert(message) {
            logger.log(`New message to broadcast: ${JSON.stringify(message, null, 4)}`);
            await messagesRepository.create(message);
        }

        async function read(device) {
            let messages;
            try {
                messages = await messagesRepository.read(device);
            } catch(error) {
                throw error;
            }
            return messages;
        }
    }

}