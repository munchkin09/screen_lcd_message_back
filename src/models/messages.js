const { createTable, checkTable, createMessage, readMessages } = require('./sql_statements/sql_messages');

const buildMessagesRepository = async (log, db, dvcs) => {
  const database = db;
  const logger = log;
  const devices = dvcs.map(dvc => dvc.name);
  return {
    create,
    read
  }

  function create(message) {
    return new Promise(async (resolve, reject) => {
      try {
        const insertStatement = database.prepare(createMessage)
        await Promise.all(devices.map(device => {
          return new Promise((resolve, reject) => {
            insertStatement.run(null, message, device)
            resolve();
          })
        }));
      } catch (error) {
        if (error.message !== "table messages already exists") {
          logger.error(`[MessagesRepository-create]\n${JSON.stringify(error)}`);
          return reject(new Error(error.message));
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
        messages = readStatement.all(device);
        logger.info("Data retrieved from DB:");
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
