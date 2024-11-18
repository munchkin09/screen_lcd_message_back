const { exec } = require("child_process");
describe("Backend behaviour", () => {

    afterEach(async () => {
        await stopServer();
        await removeDB();
        console.log("afterAll finish")
    })

    test("Happy path, should work flawlessly", async () => {
        const expectedResponse = [{ message: "Hola, este es un mensaje de prueba cargado desde un fichero" },
            { message: "ESTO ES UN MENSAJE RECIBIDO POR API" }
        ];
        await runServer("npm run test:e2e:backend")

        const response = (await (await fetch("http://localhost:3000/api/v1/messages?device=test_device1", {
            method: "GET",
            headers: {
                apiKey: '111111111'
            }
        })).json()).message;

        expect(response).toEqual(expectedResponse)
    });

    describe("Error handling", () => {
        test("Should no start when no DB path is given", async () => {
            const expectedError = "DB path is not valid, should be absolute path or relative to execution folder";
            const executionOutput = await runServer("npm run test:e2e:backend-db-no-path");

            expect(executionOutput).toStrictEqual(expect.stringContaining(expectedError));

        })

        test("Should no start when port is in wrong format", async () => {
            const expectedError = "Port is mandatory";
            const executionOutput = await runServer("npm run test:e2e:backend-no-port");

            expect(executionOutput).toStrictEqual(expect.stringContaining(expectedError));

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
        setTimeout(() => res(stdoutReturned), 300);
    })

}

function stopServer() {
    return new Promise((res) => {
        setTimeout(() => {
            server.kill()
            res()
        }, 300);
    })
}

//TODO DB Teardown
function removeDB() {
    return new Promise((res) => {
        res();
    })
}
