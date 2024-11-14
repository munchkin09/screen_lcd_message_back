const { exec } = require("child_process");
describe("Backend behaviour", () => {

    beforeAll(async () => {
    })

    afterAll(async () => {
        await stopServer();
        console.log("afterAll finish")
    })

    test("Happy path, should work flawlessly", async () => {
        const expectedResponse = "Hola, este es un mensaje de prueba cargado desde un fichero";

        await runServer("npm run test:e2e:backend")

        const response = (await (await fetch("http://localhost:3000/api/v1/messages?device=test_device1")).json()).message;

        expect(response).toStrictEqual(expectedResponse)
    });

    describe("Error handling", () => {
        test("Should no start when no messages path is given", async () => {
            const expectedError = "Messages path not valid, should be absolute path or relative to execution folder";
            const executionOutput = await runServer("npm run test:e2e:backend-messages-no-path");

            expect(executionOutput).toStrictEqual(expect.stringContaining(expectedError))

        })

        test("Should no start when no messages path is given", async () => {
            const expectedError = "Messages path not valid, should be absolute path or relative to execution folder";
            const executionOutput = await runServer("npm run test:e2e:backend-no-port");

            expect(executionOutput).toStrictEqual(expect.stringContaining(expectedError))

        })
    })
    
});

let server;

async function runServer (command) {
    let stdoutReturned;
    server = exec(command, (error, stdout, stderr) => {
        stdoutReturned = stdout
    });
    return new Promise((res) => {
        setTimeout(() => res(stdoutReturned), 250);
    })
    
}



function stopServer() {
    return new Promise((res) => {
        setTimeout(() => {
            server.kill()
            res()
        }, 700);
    })
}