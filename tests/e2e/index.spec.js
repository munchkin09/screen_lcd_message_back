const { exec } = require("child_process");
describe("Backend behaviour", () => {

    afterEach(async () => {
        await stopServer();
        await removeDB();
    })

    test("Happy path, should work flawlessly", async () => {
        await runServer("npm run test:e2e:backend");
        const url = "http://localhost:3000/api/v1/messages";
        const devid = "1";
        const apikey = "111111111";

        const postOptions = {
            method: "POST",
            headers: { devid, apikey, 'Content-Type': 'application/json' },
            body: '{"message":"Hola, este es un mensaje de prueba cargado desde un test"}'
        };
        const getOptions = {
            method: "GET",
            headers: {
                devid,
                apikey
            }
        };

        const expectedResponse = [{ message: "Hola, este es un mensaje de prueba cargado desde un test" }];
        await fetch(url, postOptions);
        await sleep(100, "");

        const response = (await (await fetch(url, getOptions)).json()).messages;

        expect(response).toEqual(expectedResponse);
    });

    describe("Error handling", () => {

        describe("Initialize", () => {
            test("Should no start when no DB path is given", async () => {
                const expectedError = "DB path is not valid, should be absolute path or relative to execution folder";
                const executionOutput = await runServer("npm run test:e2e:backend-db-no-path");

                expect(executionOutput).toStrictEqual(expect.stringContaining(expectedError));

            })

            test("Should no start when port is in wrong format", async () => {
                const expectedError = "Port is mandatory";
                const executionOutput = await runServer("npm run test:e2e:backend-no-port");

                expect(executionOutput).toStrictEqual(expect.stringContaining(expectedError));

            });
        });

    });

});

let server;

async function runServer(command) {
    let stdoutReturned;
    server = exec(command, (error, stdout, stderr) => {
        stdoutReturned = stdout;
    });
    await sleep(500);
    return stdoutReturned;

}

function stopServer() {
    return new Promise((res) => {
        setTimeout(() => {
            server.kill();
            res();
        }, 450);
    })
}

//TODO DB Teardown
function removeDB() {
    return new Promise((res) => {
        res();
    })
}

function sleep(ms, value) {
    return new Promise((res) => {
        setTimeout(() => res(value), ms);
    });
}
