const express = require('express');
const app = express(); // Initialize the Express App

const { print } = require('./utils');
const { buildV1Routes } = require('./routes');

module.exports = {
    startServer: async (port, apiKey, logger, messagesController) => {
        app.use(express.json());
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        const routesV1 = buildV1Routes(apiKey, logger, messagesController);
        app.use("/api/v1/", routesV1);

        app.listen(port, () => {
            app._router.stack.forEach(print.bind(null, []))
            logger.info(`Listening on port ${port}`)
        });

    }
}
