const { buildMessagesController } = require('../../src/controllers/messages')

const fakeLog = {
    log: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
}

describe('Utests for messages controller logic', () => {
    test('Should load a list of messages', () => {
        const messagesFixtures = { test_1: "testing message set" }
        const messagesController = buildMessagesController(fakeLog);
        messagesController.setMessages(messagesFixtures);

        expect(messagesController.getMessage("test_1")).toStrictEqual("testing message set")
    })
})