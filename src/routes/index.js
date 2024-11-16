const router = require('express').Router();
const { body, header, validationResult } = require("express-validator");

function buildV1Routes(key, logger, messagesController) {
    const apiKey = key;
    router.all('/messages', [
            [
            header("apikey").equals(apiKey)
            ]
        ], 
        (req, res, next) => {
        logger.info(`Request make. Headers associated => ${JSON.stringify(req.headers, null, 4)}`)
        
        const errors = validationResult(req);
  
        
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).end();
    });
    
    router.get('/messages',async (req, res, next) => {
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

    router.post('/messages', [
            [
            body("message").notEmpty().trim()
            ],
        ], async (req, res, next) => {
        const message = req.body.message.toString();

        try {
            await messagesController.insert(message)
        } catch(error) {
            return next(error)
        }
    
        return res.status(200).json({
            message
        });
    })
    return router            
}

module.exports = {
    buildV1Routes
}
