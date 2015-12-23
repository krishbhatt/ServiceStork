var express = require('express');
var CurrenciesModel = require('../models/CurrenciesModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var passport = require('passport');
var auth = require('../config/auth');

router.get('/',auth.authorize,  function(req, res, next) {
   CurrenciesModel.find({
        "isactive": true,
        "isdeleted": false
      }, function(err, currencies) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", currencies,req.headers.responsetype));
   });  
});


router.get('/:id',auth.authorize, function(req, res, next) {
   
   var _currencyid = req.params.id;
   CurrenciesModel.findOne({
            "_id": _currencyid
      }, function(err, currency) {
	
         if (err){
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else{
                  if (currency == null) {
                     return res.send(messages.CustomExceptionHandler("authorization", 'Currency is not valid.',req.headers.responsetype));
                  }else{
                     return res.send(messages.CustomExceptionHandler("success", currency,req.headers.responsetype));
                  }
	       
         }
      })
});


router.post('/',auth.authorize, function(req, res, next) {
      req.check('name', 'Currency name should not be blank.').notEmpty();
      req.check('code', 'Currency code should not be blank.').notEmpty();
      req.check('symbol', 'Currency symbol should not be blank.').notEmpty();
      req.check('isbasecurrency', 'Base currency should be true or false(boolean).').isBoolean();
      req.check('userid', 'User should not be blank.').notEmpty();
      var name = req.body.name;
      var code = req.body.code;
      var symbol = req.body.symbol;
      var isbasecurrency = req.body.isbasecurrency;
      var addedby = req.body.userid;
      var modifiedby = req.body.userid;
      var errors = req.validationErrors();
      if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
      }else{
            
            CurrenciesModel.findOne({
                     "name":name,
                      "isactive": true,
                     "isdeleted": false
                  }, function (err, currencyExist) { 
                  if(err) 
                  {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
                  }
                  else if(currencyExist)
                  {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Currency already exists",req.headers.responsetype));
                  }
                  else
                  {
                           var _currency = new CurrenciesModel({
                                 'name': name,
                                 'code' : code,
                                 'symbol' : symbol,
                                 'isbasecurrency' : isbasecurrency,
                                 'addedby':addedby,
                                 'modifiedby':modifiedby
                           });
                           _currency.save(function(error) {        
                              if (error)        
                                       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
                              else
                                       return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
                           });
                  }
            });
      }
});


router.put('/',auth.authorize, function(req, res, next) {
   req.check('currencyid', 'Currency id should not be blank.').notEmpty();
   req.check('name', 'Currency name should not be blank.').notEmpty();
   req.check('code', 'Currency code should not be blank.').notEmpty();
   req.check('symbol', 'Currency symbol should not be blank.').notEmpty();
   req.check('isbasecurrency', 'Base currency should be true or false(boolean).').isBoolean();
   req.check('userid', 'User should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _currencyid = req.body.currencyid;
   var name = req.body.name;
   var code = req.body.code;
   var symbol = req.body.symbol;
   var isbasecurrency = req.body.isbasecurrency;
   var modifiedby = req.body.userid; 
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
	
         return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
   }else{
	    
	    CurrenciesModel.findOne({
                  "name":name,
                   "isactive": true,
                  "isdeleted": false,
                  '_id':{$ne:_currencyid}
	    }, function (err, currencyExist){
                     if (err) 
                     {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
                     }
                     else if(currencyExist)
                     {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Currency already exist.",req.headers.responsetype));
                     }
                     else
                     {
			CurrenciesModel.findOne({
			'_id':_currencyid
                                 }, function (error, findcurrency) {
		    	    	    if (error) 
				    {
				       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
				    }
				    else if(findcurrency)
				    {
					CurrenciesModel.update({
						'_id': _currencyid
					},{
					    $set: {		
						    'name': name,
                                                    'code' : code,
                                                    'symbol' : symbol,
                                                    'isbasecurrency' : isbasecurrency,
						    'modifiedby':modifiedby,
						    'modifieddate':modifieddate,
						    'isdeleted':isdeleted,
						    'isactive':isactive
					    }
					},function(errupdate, currencyupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
					});
				    }
				    else
				    {
					return res.send(messages.CustomExceptionHandler("authorization", "Currency could not found!",req.headers.responsetype));
				    }
				});
		    }
	    });
    }
    
});

router.delete('/:currencyid',auth.authorize, function(req, res, next) {
    var _currencyid = req.params.currencyid;
    CurrenciesModel.findOne({'_id':_currencyid},function(err, currencyExist){
	if (err) 
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
	else if(currencyExist)
	{
		CurrenciesModel.update({
			    '_id': _currencyid
		},{
		    $set: {		
		      'isdeleted': true
		    }
		},function(errupdate, _currencyupdate) {
			if (errupdate)
			   return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			   return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		});
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Currency could not found!",req.headers.responsetype));
	}
    });
});


module.exports = router;