module.exports = {
    checkTable: "SELECT count(*) AS count FROM sqlite_schema WHERE type='table' AND name='devices';",
    createTable: `
        CREATE TABLE devices(
            key INTEGER PRIMARY KEY,
            name TEXT
        ) STRICT
    `,
    createDevice: "INSERT INTO devices (key, name) VALUES (?, ?)",
    readDevices: "SELECT name FROM devices"
}