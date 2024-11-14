const router = require('express').Router()

function buildV1Routes(apiKey, logger, messagesController) {
    router.all('/messages', (req, res, next) => {
        //Do your validations here
        logger.log("IM a logger on middleware")
        next();
    });
    
    router.get('/messages',async (req, res, next) => {
        let message;
        logger.log(req.params)
        try {
            message = await messagesController.getMessage(req.query.device)
    
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
