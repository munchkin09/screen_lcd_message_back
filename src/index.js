const { cwd } = require('process');
const fs = require('fs/promises')
const path = require('path');

const port = process.env.PORT;
const apiKey = process.env.API_KEY;
const messagesPath = process.env.MESSAGES;

const { messagesController } = require('./controllers');
const { startServer } = require('./server');
let messages = {};

(async () => {
    const normalizedPath = path.resolve(cwd(), messagesPath)
    const plainMessages = (await fs.readFile(normalizedPath, 'utf8')).split('\n')

    plainMessages.forEach(rawMessage => {
        const [device, message] = rawMessage.split('|')
        messages[device] = message;
    })

    messagesController.setMessages(messages)
    await startServer(port, apiKey, messagesController)
})()


