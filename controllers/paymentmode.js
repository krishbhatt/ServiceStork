var express = require('express');
var PaymentModeModel = require('../models/PaymentModeModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');


router.post('/',function(req, res, next) {
   req.check('paymentmodename', 'Payment Mode name should not be blank.').notEmpty();
   var name = req.body.paymentmodename;
   var addedby = req.body.userid;
   var modifiedby = req.body.userid;
   var errors = req.validationErrors();
   if (errors) {
      return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
   
   }else{
         
      PaymentModeModel.findOne({
            "name":name,
             "isactive": true,
            "isdeleted": false
         }, function (err, paymentmodeExist) { 
            if(err) 
            {
               return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
            }
            else if(paymentmodeExist)
            {
               return res.send(messages.CustomExceptionHandler("duplicatecheck", "Payment Mode already exists",req.headers.responsetype));
            }
            else
            {
             var _PaymentModeModel = new PaymentModeModel({
			'name': name,
			'addedby':addedby,
			'modifiedby':modifiedby
                  });
                  _PaymentModeModel.save(function(error) {        
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
   PaymentModeModel.find({
        "isactive": true,
        "isdeleted": false
      }, function(err, PaymentModes) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", PaymentModes,req.headers.responsetype));
   });  
});


router.get('/:id', function(req, res, next) {
   
   var _PaymentModeid = req.params.id;
   PaymentModeModel.findOne({
            "_id": _PaymentModeid
      }, function(err, PaymentMode) {
	
          if (err)
      {
              return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
      }
      else
      {
              return res.send(messages.CustomExceptionHandler("success", PaymentMode,req.headers.responsetype));
      }
      })
});


router.put('/', function(req, res, next) {
   
   req.check('paymentmodeid', 'Paymentmode id should not be blank.').notEmpty();
   req.check('paymentmodename', 'Paymentmode name should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _paymentmodeid= req.body.paymentmodeid;
   var name = req.body.paymentmodename;
   var modifiedby = req.body.userid;
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
      return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
   
   }else{
	    PaymentModeModel.findOne({
		    "name":name,
        "isactive": true,
        "isdeleted": false,
		    '_id':{$ne:_paymentmodeid}
		}, function (err, paymentmodeExist){
		    if (err) 
		    {
			    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
		    }
		    else if(paymentmodeExist)
		    {
			    return res.send(messages.CustomExceptionHandler("duplicatecheck", "Paymentmode name already exists",req.headers.responsetype));
		    }
		    else
		    {
			    PaymentModeModel.findOne({
				    '_id':_paymentmodeid
				}, function (error, findpayment) {
					if (error) 
					{
						return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
					}
					else if(findpayment)
					{
					    PaymentModeModel.update({
						'_id': _paymentmodeid
					    },{
						$set: {		
							'name': name,
							'modifiedby':modifiedby,
							'modifieddate':modifieddate,
							'isdeleted':isdeleted,
							'isactive':isactive
						    }
					    },function(errupdate, paymentmodedate) {
						if (errupdate)
						   return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
						else
						   return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
						});
					}
					else
					{
						return res.send(messages.CustomExceptionHandler("authorization", "Payment Mode  could not found!",req.headers.responsetype));
					}
			    });
		}
	});
    }
});


router.delete('/:paymentmodeid', function(req, res, next) {
    var _paymentmodeid = req.params.paymentmodeid;
    PaymentModeModel.findOne({'_id':_paymentmodeid},function(err,paymentmodeExist){
	if (err) 
	{
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
	else if(paymentmodeExist)
	{
		PaymentModeModel.update({
				'_id': _paymentmodeid
			},{
			$set: {		
			    'isdeleted': true
			}
		    },function(errupdate, paymentModeupdate) {
			if (errupdate)       
				return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
				return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		    });
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Payment Mode could not found!",req.headers.responsetype));
	}
    });
});

module.exports = router;