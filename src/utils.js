function sleep(ms, value) {
    return new Promise((res) => {
        setTimeout(() => res(value), ms);
    });
}

module.exports = {
    sleep
}