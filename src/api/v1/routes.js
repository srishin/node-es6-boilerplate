const express = require('express'),
  validator = require('../../middleware/validateToken'),
  user = require('./user'),
  login = require('./login'),
  transactions = require('./transactions');

const router = express.Router();
router.use('/login', login);
router.use('/*', validator); // Validate all end points
router.use('/user', user);
router.use('/transactions', transactions);

module.exports = router;
