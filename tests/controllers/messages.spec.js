const { buildMessagesController } = require('../../src/controllers/messages');

const fakeLog = {
    log: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
};

describe('Utests for messages controller logic', () => {
    test('Should accept a message', async () => {
        const messageToAdd = "testing message set";
        const messageFixture = "testing message set";
        const fakeMsgRepository = {
            createWith: jest.fn(),
            readMessagesFor: jest.fn(),
            deleteMessagesFor: jest.fn()
        }

        const { setMessage } = buildMessagesController(fakeLog, fakeMsgRepository);
        await setMessage(messageToAdd);

        expect(fakeMsgRepository.createWith).toHaveBeenCalledWith(messageFixture);
    });

    test('Should not accept an empty message', async () => {
        const messageToAdd = "  ";
        
        const fakeMsgRepository = {
            createWith: jest.fn(),
            readMessagesFor: jest.fn(),
            deleteMessagesFor: jest.fn()
        };

        const { setMessage } = buildMessagesController(fakeLog, fakeMsgRepository);
        try {
            await setMessage(messageToAdd);
        } catch (error) {
            console.log(error);
        }

        
    });
});