const { cwd } = require('process');
const fs = require('fs/promises')
const path = require('path');

const port = process.env.PORT;
const apiKey = process.env.API_KEY;
const messagesPath = process.env.MESSAGES;
const logName = 'backend_log.log'

const { buildMessagesController } = require('./controllers');
const { startServer } = require('./server');
const { buildLogger } = require('./ Logger');

let logger;
let messages = {};

//Entry point for backend startup
(async () => {
    try {
        validateEnvironmentParams()
    } catch (error) {
        console.log("Something goes wrong on validation, error is: ", error)
    }

    logger = await buildLogger('file', logName);
    const messagesController = buildMessagesController(logger);
    await setupMessages(messagesController);
    await startServer(port, apiKey, logger, messagesController);


    function validateEnvironmentParams() {
        if (Number.isNaN(port)) {
            throw new Error("Port is mandatory");
        }

        try {
            path.basename(messagesPath)
        } catch(error) {
            throw new Error("Messages path not valid, should be absolute path or relative to execution folder");
        }
    }

    async function setupMessages(messagesController) {
        const normalizedPath = path.resolve(cwd(), messagesPath);
        const plainMessages = (await fs.readFile(normalizedPath, 'utf8')).split('\n');
    
        plainMessages.forEach(rawMessage => {
            const [device, message] = rawMessage.split('|');
            messages[device] = message;
        })
        messagesController.setMessages(messages);
    
    }

})()
