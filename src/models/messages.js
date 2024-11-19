const { sleep } = require('../utils');
const { createTable, checkTable, createMessage, readMessages, deleteMessages } = require('./sql_statements/sql_messages');

const buildMessagesRepository = async (log, db, dvcs) => {
  const database = db;
  const logger = log;
  const devices = dvcs.map(dvc => dvc.name);
  return {
    createWith,
    readMessagesFor,
    deleteMessagesFor
  }

async function createWith(message) {
    try {
      await Promise.all(devices.map(async device => {
        const insertStatement = database.prepare(createMessage);
        insertStatement.run(null, message, device);
        await sleep(120);

      }));
    } catch (error) {
      if (error.message !== "table messages already exists") {
        logger.error(`[MessagesRepository-create]\n${JSON.stringify(error)}`);
        return reject(new Error(error.message));
      }
    }
  }

  function readMessagesFor(device) {
    return new Promise((resolve, reject) => {
      let messages;
      try {
        logger.warn(readMessages);
        const readStatement = database.prepare(readMessages)
        messages = readStatement.all(device);
        logger.info("Data retrieved from DB:");
      } catch (error) {
        logger.error(`[MessagesRepository-read]\n${JSON.stringify(error)}`);
        return reject(new Error(error.message));
      }

      return resolve(messages);
    })
  }

  function deleteMessagesFor(device) {
    return new Promise((resolve, reject) => {
      let messages;
      try {
        
        const deleteStatement = database.prepare(deleteMessages);
        messages = deleteStatement.run(device);
        logger.info(`Data deleted from DB for ${device}`);
      } catch (error) {
        logger.error(`[MessagesRepository-read]\n${JSON.stringify(error)}`);
        return reject(new Error(error.message));
      }

      return resolve(messages);
    })
  }

}

const initializeMessagesDb = (logger, db) => {
  const database = db;
  return new Promise(async (resolve, reject) => {
    if ((await checkTableState()) === true) {
      return resolve()
    }

    try {
      database.exec(createTable);
    } catch (error) {
      if (error.message !== "table messages already exists") {
        logger.error(`[MessagesRepository-initalizeDb]\n${JSON.stringify(error)}`);
        return reject(new Error(error.message));
      }
    }

    return resolve();
  })

  async function checkTableState() {
    return new Promise((resolve, reject) => {
      const sql = database.prepare(checkTable);
      let result;

      try {
        result = sql.run();
      } catch (error) {
        logger.error(`[MessagesRepository-initalizeDb]\n${JSON.stringify(error)}`);
        return reject(new Error(error.message));
      }

      return resolve(result['count'] > 0 ? true : false);
    })
  }
}

module.exports = {
  buildMessagesRepository,
  initializeMessagesDb
}
