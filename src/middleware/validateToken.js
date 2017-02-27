const express = require('express'),
    jwt = require('jsonwebtoken'),
    config = require('../config/config.json');

let router = express.Router();

router.use(function(req, res, next) {
    var token = req.headers['x-auth-token'];
    console.log('Validating', token);
    if (token) {
        try {
            var decoded = jwt.verify(token, config.appSecret);
            req.body.userId = decoded.user.id;
            req.body.userType = decoded.user.type;
            return next();
        } catch (err) {
            res.status(422);
            res.json({
                "message": err,
                "error": "Invalid token/Key"
            });
        }
    } else {
        res.status(401);
        res.json({
            "message": "Invalid Token or Key"
        });
        return;
    }
});


module.exports = router;
