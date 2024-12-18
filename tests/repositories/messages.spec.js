const path = require('path');
const sqlite = require('node:sqlite');

const { checkTable } = require('../../src/models/sql_statements/sql_messages');
const { buildMessagesRepository, initializeMessagesDb } = require('../../src/models/messages');

const fakeLog = {
    log: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
}

describe("Messages Repository SQL Lite implementation", () => {
    test("Should create a new DB with given data", async () => {
        const dbPath = "tests/fixtures/repositories/empty-db.db"
        const database = new sqlite.DatabaseSync(dbPath);

        await initializeMessagesDb(fakeLog, database);

        database.prepare(checkTable)
    });

    test("Should build a messages repo and return a valid interface", async () => {
        const dbPath = "tests/fixtures/db.db"
        const database = new sqlite.DatabaseSync(dbPath);
        const messagesRepo = await buildMessagesRepository(fakeLog, database, ["test_device1", "test_device2"])

        expect(JSON.stringify(messagesRepo)).toStrictEqual(JSON.stringify({ create: () => {}, read: () => {}}));
    });

    test("Should build a messages repo and insert succefully", async () => {
        const dbPath = "tests/fixtures/db.db"
        const database = new sqlite.DatabaseSync(dbPath);
        const messagesRepo = await buildMessagesRepository(fakeLog, database, ["test_device1", "test_device2"])

        expect(JSON.stringify(messagesRepo)).toStrictEqual(JSON.stringify({ create: () => {}, read: () => {}}));
    });
})