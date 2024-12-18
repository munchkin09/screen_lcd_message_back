module.exports = {
    checkTable: "SELECT count(*) FROM sqlite_schema WHERE type='table' AND name='messages';",
    createTable: `
        CREATE TABLE messages(
            key INTEGER PRIMARY KEY,
            device INTEGER,
            message TEXT
        ) STRICT
    `,
    createMessage: "INSERT INTO messages (key, message, device) VALUES (?, ?, ?)",
    readMessages: "SELECT message FROM messages WHERE device = ? ",
    deleteMessages: "DELETE FROM messages WHERE device = ?"
}