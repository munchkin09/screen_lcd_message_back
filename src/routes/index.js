const router = require('express').Router();
const { buildMessagesRouter } = require('./messages');

module.exports = {
    buildV1Routes: (key, logger, messagesController) => {
        const messagesRouter = buildMessagesRouter(key, logger, messagesController);
    
        router.use('/messages', messagesRouter);
    
        return router;
    }
}
