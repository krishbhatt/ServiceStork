var express = require('express');
var PaymentLogModel = require('../models/PaymentLogModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');


router.post('/',function(req, res, next) {
   req.check('orderid', 'order id should not be blank.').notEmpty();
   var orderid = req.body.orderid;
   var paymentmodeid = req.body.paymentmodeid;
   var transactionnumber = req.body.transactionnumber;
   var transactiondate = req.body.transactiondate;
   var amount=req.body.amount;
   var issuccess = req.body.issuccess;
   var transactionmessage = req.body.transactionmessage;
   var addedby = req.body.userid;
   var modifiedby = req.body.userid;
   var errors = req.validationErrors();
   if (errors) {
      return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
   
   }else{
         
      PaymentLogModel.findOne({
            "orderid":orderid,
             "isactive": true,
            "isdeleted": false
         }, function (err, paymentlogExist) { 
            if(err) 
            {
               return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
            }
            else if(paymentlogExist)
            {
               return res.send(messages.CustomExceptionHandler("duplicatecheck", "Payment Log already exists",req.headers.responsetype));
            }
            else
            {
             var _PaymentLogModel = new PaymentLogModel({
				'orderid': orderid,
				'paymentmodeid': paymentmodeid,
				'transactionnumber': transactionnumber,
				'transactiondate': transactiondate,
				'amount':amount,
				'issuccess': issuccess,
				'transactionmessage': transactionmessage,
				'addedby':addedby,
				'modifiedby':modifiedby
                  });
                  _PaymentLogModel.save(function(error) {        
                     if (error)        
			return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
		     else
                        return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
                  });
            }
         });
   }
    
});


router.get('/',  function(req, res, next) {
   PaymentLogModel.find({
        "isactive": true,
        "isdeleted": false
      }, function(err, PaymentLogs) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", PaymentLogs,req.headers.responsetype));
   });  
});


router.get('/:id', function(req, res, next) {
   
   var _PaymentLogid = req.params.id;
   PaymentLogModel.findOne({
            "_id": _PaymentLogid
      }, function(err, PaymentLog) {
	
          if (err)
      {
              return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
      }
      else
      {
              return res.send(messages.CustomExceptionHandler("success", PaymentLog,req.headers.responsetype));
      }
      })
});


router.put('/', function(req, res, next) {
   
   req.check('paymentlogid', 'Paymentlogid should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _paymentlogid= req.body.paymentlogid;
   var orderid = req.body.orderid;
   var paymentmodeid = req.body.paymentmodeid;
   var transactionnumber = req.body.transactionnumber;
   var transactiondate = req.body.transactiondate;
   var amount=req.body.amount;
   var issuccess = req.body.issuccess;
   var transactionmessage = req.body.transactionmessage;
   var modifiedby = req.body.userid;
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
      return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
   
   }else{
	    PaymentLogModel.findOne({
		    'orderid': orderid,
            "isactive": true,
            "isdeleted": false,
		    '_id':{$ne:_paymentlogid}
		}, function (err, paymentlogExist){
		    if (err) 
		    {
			    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
		    }
		    else if(paymentlogExist)
		    {
			    return res.send(messages.CustomExceptionHandler("duplicatecheck", "Paymentlog already exists",req.headers.responsetype));
		    }
		    else
		    {
			    PaymentLogModel.findOne({
				    '_id':_paymentlogid
				}, function (error, findpayment) {
					if (error) 
					{
						return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
					}
					else if(findpayment)
					{
					    PaymentLogModel.update({
						'_id': _paymentlogid
					    },{
						$set: {		
						    'orderid': orderid,
							'paymentmodeid': paymentmodeid,
							'transactionnumber': transactionnumber,
							'transactiondate': transactiondate,
							'amount':amount,
							'issuccess': issuccess,
							'transactionmessage': transactionmessage,
							'modifiedby':modifiedby,
							'modifieddate':modifieddate,
							'isdeleted':isdeleted,
							'isactive':isactive
						    }
					    },function(errupdate, paymentlogdate) {
						if (errupdate)
						   return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
						else
						   return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
						});
					}
					else
					{
						return res.send(messages.CustomExceptionHandler("authorization", "Payment Log  could not found!",req.headers.responsetype));
					}
			    });
		}
	});
    }
});


router.delete('/:paymentlogid', function(req, res, next) {
    var _paymentlogid = req.params.paymentlogid;
    PaymentLogModel.findOne({'_id':_paymentlogid},function(err,paymentlogExist){
	if (err) 
	{
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
	else if(paymentlogExist)
	{
		PaymentLogModel.update({
				'_id': _paymentlogid
			},{
			$set: {		
			    'isdeleted': true
			}
		    },function(errupdate, paymentLogupdate) {
			if (errupdate)       
				return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
				return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		    });
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Payment Log could not found!",req.headers.responsetype));
	}
    });
});

module.exports = router;