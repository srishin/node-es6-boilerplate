const express = require('express'),
    md5 = require('md5'),
    jwt = require('jsonwebtoken'),
    models = require('../../models/index'),
    config = require('../../config/config.json');

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
    if (!req.body.password) {
        return res.status(422).send();
    }
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
        console.log(user);
        user.accessToken = jwt.sign({ user: user, expiresIn: 60 * 60 * 7, algorithm: 'RS512' }, config.appSecret);
        return res.json(user);
    });

    login.catch(() => {
        return res.status(422).send();
    });

});

module.exports = router;