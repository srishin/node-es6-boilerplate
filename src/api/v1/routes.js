import express from 'express';
import validator from '../../middleware/validateToken';
import user from './user';
import login from './login';

const router = express.Router();
router.use('/login', login);
router.use('/*', validator); // Validate all end points 
router.use('/user', user);

module.exports = router;
