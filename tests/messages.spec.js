const { messagesController } = require('../src/controllers/messages')


describe('Utests for messages controller logic', () => {
    test('Should load a list of messages', () => {
        const messagesFixtures = { test_1: "testing message set" }

        messagesController.setMessages(messagesFixtures)

        expect(messagesController.getMessage("test_1")).toStrictEqual("testing message set")
    })
})