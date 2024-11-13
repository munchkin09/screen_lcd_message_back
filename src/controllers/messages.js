let messages = {
    "pepe": "HOLA!" 
};

function setMessages(messagesToLoad) {
    console.log("MESSAGES LOADED: ", messagesToLoad)
    messages = messagesToLoad
}


function getMessage(device) {
    let message;
    try {
        message = messages[device]
        messages[device] = ""
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