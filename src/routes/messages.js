const router = require('express').Router();
const { body, header, validationResult } = require("express-validator");

module.exports = {
    buildMessagesRouter: (apiKey, logger, msgController) => {
        const messagesController = msgController;
        router.all('/', [
            [
            header("apikey").equals(apiKey)
            ]
        ], 
        (req, res, next) => {
            logger.info(`Request make. Headers associated => ${JSON.stringify(req.headers, null, 4)}`)
            logger.info(req.body);
            const errors = validationResult(req);

            if (errors.isEmpty()) {
                return next();
            }

            res.status(400).end();
        });

        router.get('/',async (req, res, next) => {
            let message;

            try {
                message = await messagesController.getMessages(req.query.device)
                logger.info(message);
            } catch(error) {
                logger.error(error);
                return next(error);
            }

            return res.status(200).json({
                message
            });
        })

        router.post('/', [
            [
            body("message").notEmpty().trim()
            ],
        ], async (req, res, next) => {
            const errors = validationResult(req);
            if (errors.isEmpty() === false) {
                return next(new Error("Validation error. Message is mandatory"));
            }
            const message = req.body.message.toString();
            
            try {
                await messagesController.setMessage(message)
            } catch(error) {
                return next(error)
            }

            return res.status(200).json({
                message
            });
        })

        return router;
    }
}