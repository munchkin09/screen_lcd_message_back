const { cwd } = require('process');
const fs = require('fs/promises')
const path = require('path');

const port = process.env.PORT;
const apiKey = process.env.API_KEY;
const dbPath = process.env.DB;
const logName = 'backend_log.log'

const buildRepositories = require('./models');
const { buildMessagesController } = require('./controllers');
const { startServer } = require('./server');
const { buildLogger } = require('./ Logger');

let logger;

//Entry point for backend startup
(async () => {
    try {
        validateEnvironmentParams()
    } catch (error) {
        console.log("Something goes wrong on validation, error is: ", error)
        return;
    }

    logger = await buildLogger('file', logName);
    const { devicesRepository, messagesRepository } = await buildRepositories(logger, dbPath);
    const messagesController = buildMessagesController(logger, messagesRepository);

    await startServer(port, apiKey, logger, messagesController);

    function validateEnvironmentParams() {
        console.log(isNaN(port));
        if (isNaN(port) === true) {
            throw new Error("Port is mandatory");
        }

        try {
            path.basename(dbPath)
        } catch(error) {
            throw new Error("DB path is not valid, should be absolute path or relative to execution folder");
        }
    }
})()
