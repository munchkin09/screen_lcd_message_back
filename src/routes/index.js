const router = require('express').Router()

function buildV1Routes(messagesController) {
    router.all('/messages', (req, res, next) => {
        console.log("IM a logger")
        next();
    });
    
    router.get('/messages',async (req, res, next) => {
        let message;
        console.log(req.params)
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
