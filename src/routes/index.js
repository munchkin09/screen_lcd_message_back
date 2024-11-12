const router = require('express').Router()

const controllers = require('../controllers')

router.all((req, res, next) => {

    next();
});

router.get('/test', (req, res) => {
    console.log("endpoint test")
    return res.status(200).json({
        message: 'success'
    })
});

exports.router = router;
