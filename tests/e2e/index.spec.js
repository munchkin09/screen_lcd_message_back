const { exec } = require("child_process");
describe("Backend behaviour", () => {

    beforeAll(async () => {
        await runServer()
        console.log("beforeAll finish")
    })

    afterAll(async () => {
        await stopServer();
        console.log("afterAll finish")
    })

    test("a", async () => {
        const expectedResponse = "Hola, este es un mensaje de prueba cargado desde un fichero";
        const response = (await (await fetch("http://localhost:3000/api/v1/messages?device=test_device1")).json()).message;
        
        expect(response).toStrictEqual(expectedResponse)
    });
});

let server;

async function runServer () {
    server = exec("npm run test:e2e:backend");
    return new Promise((res) => {
        setTimeout(() => res(), 300);
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