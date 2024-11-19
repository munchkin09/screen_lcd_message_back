const { buildMessagesController } = require('../../src/controllers/messages');

const fakeLog = {
    log: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
};

describe('Utests for messages controller logic', () => {
    test('Should load a list of messages', () => {
        const messagesFixtures = "testing message set";
        const fakeMsgRepository = {
            createWith: jest.fn(),
            readMessagesFor: jest.fn(),
            deleteMessagesFor: jest.fn()
        }

        const messagesController = buildMessagesController(fakeLog, fakeMsgRepository);
        messagesController.setMessage(messagesFixtures);

        expect(fakeMsgRepository.createWith).toHaveBeenCalledWith(messagesFixtures);
    });
});