const express = require('express');
const app = express(); // Initialize the Express App

const { buildV1Routes }= require('./routes');
const { messagesController } = require('./controllers');

const port = 3000;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const routesV1 = buildV1Routes(messagesController)
app.use("/api/v1/", routesV1);

app.listen(port, () => console.log(`Listening on port ${port}`));
