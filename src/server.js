const express = require('express');
const app = express(); // Initialize the Express App

const { buildV1Routes } = require('./routes');

module.exports = {
    startServer: async (port, apiKey, logger, messagesController) => {
        app.use(express.json());
        app.use(function (req, res, next) {
            setupCORS(req, res, next);
        });

        const routesV1 = buildV1Routes(apiKey, logger, messagesController);
        app.use("/api/v1/", routesV1);

        app.listen(port, () => {
            logger.info(`Listening on port ${port}`)
        });

    }
}

function  setupCORS(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type,Accept,X-Access-Token,X-Key, apikey, devid');
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    } 
    return next();
}
