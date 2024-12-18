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

    test('Should accept emojis', async () => {
        const messageToAdd = " 😇 ";
        
        const fakeMsgRepository = {
            createWith: jest.fn(),
            readMessagesFor: jest.fn(),
            deleteMessagesFor: jest.fn()
        };

        const { setMessage, getMessages } = buildMessagesController(fakeLog, fakeMsgRepository);
        try {
            await setMessage(messageToAdd);
            await new Promise((resolve) => { setTimeout(resolve, 1000)});
            const pepe = await getMessages("testId");
            console.log(pepe)
        } catch (error) {
            console.log(error);
        }

        
    });

    test('Should truncate message when max chars are reached', async () => {

    });

    test('Should change unrecognized chars with empty spaces', async () => {

    });

    describe('i18n', () => {
        test('Should accept any of proposed UTF-8 char', async () => {
            /*
            When you're dealing with UA strings first-hand, your best bet is probably to try to decode it as UTF-8, 
            and interpret everything that's not in the Letter, Number, Mark, or Symbol category as spaces
            */

            /*
            C0 Controls and Basic Latin 	0-127 	0000-007F
            C1 Controls and Latin-1 Supplement 	128-255 	0080-00FF
            */

            function randomizeInput () {
                const symbol = String.fromCharCode(Math.round(Math.random() * 64)); //0 a 127
                const symbol2 = String.fromCharCode(Math.round(Math.random() * 64)); //128 a 255 

                console.log(symbol + symbol2);
            }
        });
    });
});