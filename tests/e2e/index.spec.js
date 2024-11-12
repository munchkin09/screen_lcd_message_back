const { exec } = require("child_process");
describe('Backend behaviour', () => {

    beforeAll(async () => {
        await runServer()
        console.log("beforeAll finish")
    })

    afterAll(async () => {
        await stopServer();
        console.log("afterAll finish")
    })

    test('a', async () => {
        const response = { body: "message" };
        const realResponse = await fetch('http://localhost:3000/api/v1/test');
    });
});

let server;

async function runServer (port) {
    server = exec('npm run test:backend')

}

async function stopServer() {
    setTimeout(() => server.kill(), 700);
}