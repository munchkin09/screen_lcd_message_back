const sqlite = require('node:sqlite');

const { buildMessagesRepository, initializeMessagesDb } = require('../../src/models/messages');
const buildMessagesController = require('../../src/controllers/messages');
const { sleep } = require('../../src/utils');

const fakeLog = {
    log: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
};

let database;
let fakeMsgRepository;

describe('Utests for messages controller logic', () => {

    beforeEach(async () => {
        database = new sqlite.DatabaseSync(":memory:");
        await initializeMessagesDb(fakeLog, database);
        fakeMsgRepository = await buildMessagesRepository(fakeLog, database,[{ key: 1, name: 'device-1' }, { key: 2, name: 'device-2'}])
        
    });

    describe('Use Case: Device-specific Messaging', () => {
        it('should isolate messages between different devices', async () => {
            const device1Message = 'Message for device 1';
            const device2Message = 'Message for device 2';
            const { setMessage, getMessages } = buildMessagesController(fakeLog, fakeMsgRepository);

            await setMessage(device1Message);
            await setMessage(device2Message);
            await sleep(200);
            const device1Messages = await getMessages(1);
            console.log(device1Messages);
            const device2Messages = await getMessages(2);

            expect(device1Messages).toEqual(expect.arrayContaining([{"message": device1Message}, {"message": device2Message}]));
            expect(device2Messages).toEqual(expect.arrayContaining([{"message": device1Message}, {"message": device2Message}]));
        });
    });

    describe('Use Case: Message Validation', () => {
        it('should accept a string with any of the allowed characters', async () => {
            const validMessage = '123abcABC😊ñÑäÄ©✓！¿';
            const { setMessage } = buildMessagesController(fakeLog, fakeMsgRepository);
            await expect(setMessage(validMessage)).resolves.not.toThrow();
        });

        /*
        TODO: Make validations a thing :)
        it('should throw an error if restricted characters are included', async () => {
            const invalidMessage = 'Hello\x01World'; // Incluye un carácter de control inválido
            const { setMessage } = buildMessagesController(fakeLog, fakeMsgRepository);
            await expect(setMessage(invalidMessage)).rejects.toThrow('Invalid characters in message');
        });*/
    });

    describe('setMessage', () => {
        it('should accept a string with valid UTF-8 characters', async () => {
            const validMessage = 'Hello, world! 😊 こんにちは 🌍';
            const { setMessage } = buildMessagesController(fakeLog, fakeMsgRepository);
            await expect(setMessage(validMessage)).resolves.not.toThrow();
        });

        /*
        TODO: Make validations a thing :)
        it('should throw an error when invalid UTF-8 characters are given', async () => {
            const invalidMessage = 'Hello\x80World'; // Cadena con un byte inválido
            const { setMessage } = buildMessagesController(fakeLog, fakeMsgRepository);
            await expect(setMessage(invalidMessage)).rejects.toThrow('Invalid UTF-8 characters');
        });*/

        it('should handle empty strings gracefully', async () => {
            const emptyMessage = '';
            const { setMessage } = buildMessagesController(fakeLog, fakeMsgRepository);

            await expect(setMessage(emptyMessage)).resolves.not.toThrow();
        });
    });

    describe('getMessages', () => {
        it('should return all messages for a given device', async () => {
            const message1 = 'Hello, world!';
            const message2 = 'こんにちは 🌍';
            const { setMessage, getMessages } = buildMessagesController(fakeLog, fakeMsgRepository);

            await setMessage(message1);
            await setMessage(message2);

            const messages = await getMessages(1);
            expect(messages).toEqual(expect.arrayContaining([{ "message": message1 }, { "message": message2 }]));
        });

        it('should return an empty array if no messages exist', async () => {
            const { setMessage, getMessages } = buildMessagesController(fakeLog, fakeMsgRepository);
            const messages = await getMessages(1);
            expect(messages).toEqual([]);
        });
    });

    describe('deleteMessages', () => {
        it('should delete all messages for a given device', async () => {
            const message = 'Test message';
            const { setMessage, getMessages, deleteMessages } = buildMessagesController(fakeLog, fakeMsgRepository);

            await setMessage(message);

            await deleteMessages('test-device');
            const messages = await getMessages('test-device');
            expect(messages).toEqual([]);
        });

        it('should not throw an error if there are no messages to delete', async () => {
            const { deleteMessages } = buildMessagesController(fakeLog, fakeMsgRepository);
            await expect(deleteMessages('test-device')).resolves.not.toThrow();
        });
    });
});