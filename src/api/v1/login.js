import express from 'express';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import models from '../../models/index';
import config from '../../config/config.json';

const router = express.Router();

/**
  @api {post} /login Login user
  @apiVersion 1.0.0
   @apiName Login
   @apiGroup Login
@apiParam {String} email username or email of the user
@apiParam {String} password Password for user
   @apiParamExample {json} Request-Example:
  {
    "email":"srishin",
    "password":"pass"
}
 @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
  "id": 10,
  "email": "user@email.come",
  "type": null,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMCwiZW1haWwiOiJ1c2VyQGVtYWlsLmNvbWUiLCJ0eXBlIjpudWxsfSwiZXhwaXJlc0luIjozNjAwLCJhbGdvcml0aG0iOiJSUzUxMiIsImlhdCI6MTQ4NTk1MzAwNX0.73Xif66onv6np3OdpTTRbseDwfov2whfytsu9aRHErg"
}
    @apiErrorExample Error-Response:
HTTP/1.1 404 Not Found
{
	"error": "Invalid credentails"
}
 */

router.post('/', (req, res) => {
    let login = models.user.findOne({
        where: {
            $or: [{ name: req.body.email }, { email: req.body.email }],
            $and: { password: md5(req.body.password) }
        },
        attributes: ['id', 'email', 'type'],
        raw: true
    });

    login.then((user) => {
        if (!user) {
            return res.status(404).json({ error: 'Invalid credentails' });
        }
        user.accessToken = jwt.sign({ user: user, expiresIn: 60 * 60 * 7, algorithm: 'RS512' }, config.appSecret);
        res.json(user);
    });

    login.catch(() => {
        res.status(422).send();
    });

});

module.exports = router;
