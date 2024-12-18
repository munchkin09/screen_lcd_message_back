const path = require('path');
const sqlite = require('node:sqlite');

const { checkTable } = require('../../src/models/sql_statements/sql_messages');
const { buildDevicesRepository, initializeDevicesDb } = require('../../src/models/devices');

const fakeLog = {
    log: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
}

describe("Devices Repository SQL Lite implementation", () => {
    test("Should create a new DB with given data", async () => {
        const dbPath = "tests/fixtures/repositories/empty-db.db"
        const database = new sqlite.DatabaseSync(dbPath);

        await initializeDevicesDb(fakeLog, database);

        database.prepare(checkTable)
    });
})