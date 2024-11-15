const { createTable, checkTable, createMessage, readMessages } = require('./sql_statements/sql_messages');

async function buildMessagesRepository(logger, db, devices) {
  const database = db;
  return {
    create,
    read
  }

  function create(message) {
    return new Promise((resolve, reject) => {
      try {
        const insertStatement = database.prepare(createMessage)
        devices.forEach(device => insertStatement.run(null, message, device));
      } catch (error) {
        if (error.message !== "table messages already exists") {
          logger.error(`[MessagesRepository-create]\n${JSON.stringify(error)}`);
          return reject(error);
        }
      }

      return resolve();
    })
  }

  function read(device) {
    return new Promise((resolve, reject) => {
      let messages;
      try {
        const readStatement = database.prepare(readMessages)
        messages = readStatement.run(device);
      } catch (error) {
        logger.error(`[MessagesRepository-read]\n${JSON.stringify(error)}`);
        return reject(error);
      }

      return resolve(messages);
    })
  }

}

function initializeMessagesDb(logger, db) {
  const database = db;
  return new Promise(async (resolve, reject) => {
    if ((await checkTableState()) === true) {
      return resolve()
    }

    try {
      database.exec(createTable);
    } catch (error) {
      if (error.message !== "table messages already exists") {
        logger.error(`[DevicesRepository-initalizeDb]\n${JSON.stringify(error)}`);
        return reject(error);
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
        return reject(error);
      }

      return resolve(result['count'] > 0 ? true : false);
    })
  }
}

module.exports = {
  buildMessagesRepository,
  initializeMessagesDb
}
