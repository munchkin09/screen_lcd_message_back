let messages = {
    "pepe": [{ message: "HOLA!" }]
};

function setMessages(messagesToLoad) {
    messages = messagesToLoad
}


function getMessage(device) {
    let message;
    try {
        message = messages[device][0]
        messages[device] = []
    } catch(error) {
        throw error
    }

    return message
}
const messagesController = {
    setMessages,
    getMessage
};

module.exports = {
    messagesController
}