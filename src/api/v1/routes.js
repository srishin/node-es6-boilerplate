const express = require('express'),
    validator = require('../../middleware/validateToken'),
    user = require('./user'),
    login = require('./login');

const router = express.Router();
router.use('/login', login);
router.use('/*', validator); // Validate all end points 
router.use('/user', user);

module.exports = router;
