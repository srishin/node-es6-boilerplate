 const express = require('express'),
     md5 = require('md5'),
     models = require('../../models/index.js');

 let router = express.Router();
 const updateInfo = { status: [404, 200], status_text: ['Record not found', 'Update success'] };
 /**
  * @api {get} /user Get all user information
  * @apiVersion 1.0.0
  * @apiName GetAllUsers
  * @apiGroup User
   @apiSuccessExample Success-Response:
   HTTP/1.1 200 OK
  [{
     "id": 1,
     "name": "Test",
     "phone": 9598662623,
     "email": "test@sensomate.com",
     "type": 2
 }]
  * @apiErrorExample Error-Response:
  *     HTTP/1.1 404 Not Found
  *     []
  */

 router.get('/', (req, res) => {
     let promise = models.user.findAll({
         attributes: ['id', 'name', 'phone', 'email', 'type']
     });
     promise.then((userList) => {
         if (!userList.length) {
             res.status(404);
         }
         return res.json(userList);
     });
 });
 /**
 *  @api {post} /user Create new user
 *  @apiVersion 1.0.0
 *   @apiName CreateUsers
 *   @apiGroup User
 @apiParam {String} name name of the user
 @apiParam {Number} phone phone number of the user
 @apiParam {String} email Email Id of the user
 @apiParam {String} [password] Password for user
    @apiParamExample {json} Request-Example:
    {
     "name": "user name",
     "phone": 9456231453,
      "email":"user@email.com"
   }
 *   @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
      "email": "user@email.com"
    }
     @apiErrorExample Error-Response:
     HTTP/1.1 404 Not Found
      []
  */

 router.post('/', (req, res) => {
     if (req.body.password) {
         req.body.password = md5(req.body.password);
     }
     let promise = models.user.create(req.body);
     promise.then((userData) => {
         return res.json({ email: userData.email });
     });
     promise.catch((error) => {
         return res.status(500).json({ error: error.errors[0].message });
     });
 });


 /**
 *  @api {put} /user Update user
 *  @apiVersion 1.0.0
 *   @apiName UpdateUser
 *   @apiGroup User
 @apiParam {Number} id id of the user
 @apiParam {String} [name] name of the user
 @apiParam {Number} [phone] phone number of the user
 @apiParam {String} [email] Email Id of the user
    @apiParamExample {json} Request-Example:
    {
    "id": 1,
     "name": "user name",
     "phone": 9456231453,
      "email":"user@email.com"
   }
   @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
   "status": 200,
   "status_text": "Update success"
 }
     @apiErrorExample Error-Response:
     HTTP/1.1 404 Not Found
      []
  */

 router.put('/', (req, res) => {
     if (!req.body.id) {
         return res.status(422).json({ error: 'Unprocessable Entity' });
     }
     let promise = models.user.update(req.body, {
         where: { id: req.body.id }
     });
     promise.then((update) => {
         console.log(update);
         return res.json({
             status: updateInfo.status[update[0]],
             status_text: updateInfo.status_text[update[0]]
         });
     });
     promise.catch((error) => {
         return res.status(500).json({ error: error.errors[0].message });
     });
 });


 module.exports = router;
