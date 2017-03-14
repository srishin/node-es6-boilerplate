const express = require('express'),
    md5 = require('md5'),
    models = require('../../models/index.js');

let router = express.Router();
const updateInfo = { status: [404, 200], statusText: ['Record not found', 'Update success'] };
/**
 * @api {get} /transactions Get all transactions by a user
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
*  @api {post} /transactions Add new transaction
*  @apiVersion 1.0.0
*   @apiName AddTransaction
*   @apiGroup Transactions
@apiParam {String} account name of the bank
@apiParam {Number} type DEBIT(1)/CREDIT(2)/LOAN(3)
@apiParam {Number} amount transaction amount
@apiParam {String} [towards] reciever
@apiParam {String} [purpose] purpose of transaction
@apiParam {Number} [medium] medium of payment (Debit/Visa Card(1), Credit Card(2), Net Banking(3), Wallets(4), Other(5))
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
     "statusText": "Transaction success"
   }
    @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
     []
 */

router.post('/', (req, res) => {

    let promise = models.transactions.create(req.body);
    promise.then((userData) => {
        return res.status(200).json({ statusText: "Transaction success" });
    });
    promise.catch((error) => {
        return res.status(404).json({ error: error.errors[0].message });
    });
});


/**
*  @api {put} /transactions Update Transaction
*  @apiVersion 1.0.0
*   @apiName UpdateTransaction
*   @apiGroup Transactions
@apiParam {Number} id transaction id
@apiParam {String} account name of the bank
@apiParam {Number} type DEBIT(1)/CREDIT(2)/LOAN(3)
@apiParam {Number} amount transaction amount
@apiParam {String} [towards] reciever
@apiParam {String} [purpose] purpose of transaction
@apiParam {Number} [medium] medium of payment (Debit/Visa Card(1), Credit Card(2), Net Banking(3), Wallets(4), Other(5))
@apiParam {String} date transaction date
   @apiParamExample {json} Request-Example:
   {
    "id" : 1,
    "account" : "Bank name",
    "type" : 1,
    "amount" : 500,
    "date" : "2017-03-01"
  }
*   @apiSuccessExample Success-Response:
   HTTP/1.1 200 OK
   {
     "status" : 200,
     "statusText": "Update success"
   }
    @apiErrorExample Error-Response:
    HTTP/1.1 500 Not Found
    {
      "error": "Update Failed"
    }
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
            statusText: updateInfo.statusText[update[0]]
        });
    });
    promise.catch((error) => {
        return res.status(500).json({ error: "Update Failed" });
    });
});


  /**
  *  @api {delete} /transactions Delete Transaction
  *  @apiVersion 1.0.0
  *   @apiName DeleteTransaction
  *   @apiGroup Transactions
  @apiParam {Number} id transaction id
     @apiParamExample {json} Request-Example:
     {
        "id": 1
     }
    @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
        "statusText": "Delete success"
     }
      @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
       {
          "error": "Failed"
       }
   */

  router.delete('/', (req, res) => {
      if (!req.body.id) {
          return res.status(422).json({ error: 'Unprocessable Entity' });
      }
      let promise = models.transactions.destroy({
          where: { id: req.body.id }
      });
      promise.then((delstatus) => {
          console.log(delstatus);
          if(delstatus){
          return res.status(200).json({
              statusText: 'Deleted Succefully'
          });
        }
        return res.status(404).json({
            error: 'Failed'
        });
      });
      promise.catch((error) => {
          return res.status(500).json({ error: error.errors[0].message });
      });
  });


module.exports = router;
