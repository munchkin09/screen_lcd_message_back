const express = require('express');
const app = express(); // Initialize the Express App

const {router} = require('./routes')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/api/v1/", router);

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
