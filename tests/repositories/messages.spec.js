const path = require('path');
const sqlite = require('node:sqlite');

const { buildMessagesRepository, initializeMessagesDb } = require('../../src/models/messages');

const fakeLog = {
    log: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
}

describe("Messages Repository SQL Lite implementation", () => {
    test("Should create a new DB with given data", async () => {
        //const messagesRepository = await buildMessagesRepository(fakeLog, path.resolve(process.cwd(), 'test/fixtures/db-msg-repo.sql'), ['uno','dos','tres']);
        const dbPath = "tests/fixtures/db.db"
        const database = new sqlite.DatabaseSync(dbPath);
        console.log(database);
        await initializeMessagesDb(fakeLog, database);
    });
})