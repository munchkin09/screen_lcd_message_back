const fs = require('fs')
const path = require('path')

async function buildLogger(mode, logName) {
    let fileHandlerLogger;
    if (mode === 'file') {
        const logFilePath = path.resolve('/tmp',`${Date.now().toString()}_${logName}`);
        console.log(`Path for file log is: ${logFilePath}`);
        fileHandlerLogger = fs.createWriteStream(logFilePath, {
            flags: "a",
            autoClose: true
        });
    }

    return {
        log,
        warn,
        error,
        info
    };

    async function log(msg) {
        const formattedMsg = formatMessage("[📣]", msg);
        await handleWrite(formattedMsg);
        console.log(formattedMsg);
    }

    async function warn(msg) {
        const formattedMsg = formatMessage("[🤔]", msg);
        await handleWrite(formattedMsg);
        console.warn(formattedMsg);
    }

    async function error(msg) {
        const formattedMsg = formatMessage("[ℹ💀]", msg);
        await handleWrite(formattedMsg);
        console.error(formattedMsg);
    }

    async function info(msg) {
        const formattedMsg = formatMessage("[ℹ️]", msg) 
        await handleWrite(formattedMsg);
        console.info(formattedMsg);
    }

    function formatMessage(header, msg) {
        if (typeof msg === 'object') {
            msg = JSON.stringify(msg, null, 4);
        }
        return header + msg
    }

    async function handleWrite(msg) {
        if (mode === 'file') {
            await fileHandlerLogger.write(`${msg}\n`);
        }
    }
}

module.exports = {
    buildLogger
}
