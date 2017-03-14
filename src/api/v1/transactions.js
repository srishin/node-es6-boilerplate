const express = require('express'),
    md5 = require('md5'),
    models = require('../../models/index.js');

let router = express.Router();
const updateInfo = { status: [404, 200], status_text: ['Record not found', 'Update success'] };
/**
 * @api {get} /user Get all transactions by a user
 * @apiVersion 1.0.0
 * @apiName ListAllTransactions
 * @apiGroup Transactions
  @apiSuccessExample Success-Response:
  HTTP/1.1 200 OK
 [{
    "id": 1,
    "account": "Bank Name",
    "type": "DEBIT",
    "amount": 500,
    "towards": "Food Stall",
    "purpose": "Dinner Bill",
    "medium": "Debit Card",
    "date" : "2017-03-01"
}]
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     []
 */

router.get('/', (req, res) => {
    let promise = models.transactions.findAll({
      where: { userId: req.body.userId },
      attributes: ['id', 'account', 'type', 'amount', 'towards', 'purpose', 'medium', 'date']
    });
  promise.then((transactionList) => {
    if (!transactionList.length) {
      res.status(404);
    }
    return res.json(transactionList);
  });
});
/**
*  @api {post} /user Add new transaction
*  @apiVersion 1.0.0
*   @apiName AddTransaction
*   @apiGroup Transactions
@apiParam {String} account name of the bank
@apiParam {Number} DEBIT(0)/CREDIT(1)/LOAN(2)
@apiParam {Number} amount transaction amount
@apiParam {String} [towards] reciever
@apiParam {String} [purpose] purpose of transaction
@apiParam {String} [medium] medium of payment
@apiParam {String} date transaction date
   @apiParamExample {json} Request-Example:
   {
    "account" : "Bank name",
    "type" : 1,
    "amount" : 500,
    "date" : "2017-03-01"
  }
*   @apiSuccessExample Success-Response:
   HTTP/1.1 200 OK
   {
     "status_text": "Transaction success"
   }
    @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
     []
 */

router.post('/', (req, res) => {

    let promise = models.transactions.create(req.body);
    promise.then((userData) => {
        return res.status(200).json({ status_text: "Transaction success" });
    });
    promise.catch((error) => {
        return res.status(404).json({ error: error.errors[0].message });
    });
});


/**
*  @api {put} /user Update Transaction
*  @apiVersion 1.0.0
*   @apiName UpdateTransaction
*   @apiGroup Transactions
@apiParam {Number} id transaction id
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
    let promise = models.transactions.update(req.body, {
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
