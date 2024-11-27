const { sleep } = require('../utils');
const { createTable, checkTable, createMessage, readMessages, deleteMessages } = require('./sql_statements/sql_messages');

const buildMessagesRepository = async (log, db, dvcs) => {
  const database = db;
  const logger = log;
  const devices = dvcs.map(dvc => dvc.key);
  return {
    createWith,
    readMessagesFor,
    deleteMessagesFor
  }

async function createWith(message) {
    try {
      await Promise.all(devices.map(async device => {
        const insertStatement = database.prepare(createMessage);
        insertStatement.run(null, message, parseInt(device, 10));
        await sleep(120);

      }));
    } catch (error) {
      if (error.message !== "table messages already exists") {
        logger.error(`[MessagesRepository-create]\n${JSON.stringify(error)}`);
        throw error;
      }
    }
  }

async function readMessagesFor(device) {
  let messages;
  try {
    logger.warn(readMessages);
    const readStatement = database.prepare(readMessages)
    messages = readStatement.all(device);
  } catch (error) {
    logger.error(`[MessagesRepository-read]\n${JSON.stringify(error)}`);
    throw error;
  }

  return messages;

}

async function deleteMessagesFor(device) {

  let messages;
  try {
    
    const deleteStatement = database.prepare(deleteMessages);
    messages = deleteStatement.run(device);
  } catch (error) {
    logger.error(`[MessagesRepository-read]\n${JSON.stringify(error)}`);
    throw error;
  }

  return messages;
}


}

const initializeMessagesDb = async (logger, db) => {
  const database = db;
  if ((await checkTableState(database)) === true) {
    return;
  }

  try {
    database.exec(createTable);
  } catch (error) {
    if (error.message !== "table messages already exists") {
      logger.error(`[MessagesRepository-initalizeDb]\n${JSON.stringify(error)}`);
      throw error;
    }
  }
  return;
};

async function checkTableState(database) {
    const sql = database.prepare(checkTable);
    let result;

    try {
      result = sql.run();
    } catch (error) {
      logger.error(`[MessagesRepository-initalizeDb]\n${JSON.stringify(error)}`);
      throw error;
    }

    return (result['count'] > 0 ? true : false);
}

module.exports = {
  buildMessagesRepository,
  initializeMessagesDb
}
