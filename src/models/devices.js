const { createTable, checkTable, createDevice, readDevices } = require('./sql_statements/sql_devices');



async function buildDevicesRepository(logger, db) {
  const database = db;
  return {
    create,
    read
  }

  function create(device) {
    return new Promise((resolve, reject) => {
      try {
        const insertStatement = database.prepare(createDevice)
        insertStatement.run(null, device);
      } catch (error) {
        logger.error(`[DevicesRepository-create]\n${JSON.stringify(error)}`);
        return reject(error);
      }

      return resolve();
    })
  }

  function read() {
    return new Promise((resolve, reject) => {
      let devices;
      try {
        const readStatement = database.prepare(readDevices)
        devices = readStatement.run();
      } catch (error) {
        logger.error(`[DevicesRepository-read]\n${JSON.stringify(error)}`);
        return reject(error);
      }

      return resolve(devices);
    })
  }

}

function initializeDevicesDb(logger, db) {
  const database = db;
  return new Promise(async (resolve, reject) => {
    if ((await checkTableState(database)) === true) {
      return resolve();
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

  function checkTableState() {
    return new Promise((resolve, reject) => {
      const sql = database.prepare(checkTable);
      let result;
      try {
        result = sql.get();

      } catch (error) {
        logger.error(`[DevicesRepository-initalizeDb]\n${JSON.stringify(error)}`);
        return reject(error);
      }

      return resolve(result['count'] > 0 ? true : false);
    })
  }
}

module.exports = {
  buildDevicesRepository,
  initializeDevicesDb
}