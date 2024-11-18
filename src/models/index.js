const path = require('path');
const sqlite = require('node:sqlite');

const { buildDevicesRepository, initializeDevicesDb } = require('./devices');
const { buildMessagesRepository, initializeMessagesDb } = require('./messages');

let database;
module.exports = async function buildRepositories(logger, dbPath) {
    logger.info("Operating DB on PATH[" + path.resolve(dbPath) + "]");
    database = new sqlite.DatabaseSync(path.resolve(dbPath));

    logger.warn(database);

    await initializeDevicesDb(logger, database)
    await initializeMessagesDb(logger, database);

    const devicesRepository = await buildDevicesRepository(logger,database);
    const devices = await devicesRepository.read();
    const messagesRepository = await buildMessagesRepository(logger, database, devices);
    logger.info("_--*Repositories loaded succesfully*--_");

    return {
        devicesRepository,
        messagesRepository
    };
}