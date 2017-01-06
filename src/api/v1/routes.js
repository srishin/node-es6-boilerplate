import express from 'express';
import user from './user';

const router = express.Router();
router.use('/user', require('./user'));

module.exports = router;
