var express = require('express');
var SuppliesModel = require('../models/SuppliesModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');

router.get('/',auth.authorize, function(req, res, next) {
   SuppliesModel.find({
        "isactive": true,
        "isdeleted": false
      }, function(err, supplies) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", supplies,req.headers.responsetype));
   });  
});


router.get('/:id',auth.authorize, function(req, res, next) {
   
   var _supplyid = req.params.id;
   SuppliesModel.findOne({
            "_id": _supplyid
      }, function(err, supply) {
	
         if (err){
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else{
                  if (supply == null) {
                      return res.send(messages.CustomExceptionHandler("authorization", 'Supply id is not valid.',req.headers.responsetype));
                  }else{
                      return res.send(messages.CustomExceptionHandler("success", supply,req.headers.responsetype));
                  }
	       
         }
      })
});


router.post('/',auth.authorize, function(req, res, next) {
      req.check('suppliername', 'Name should not be blank.').notEmpty();
      req.check('userid', 'User should not be blank.').notEmpty();
      var name = req.body.suppliername;
      var addedby = req.body.userid;
      var modifiedby = req.body.userid;
      var errors = req.validationErrors();
      if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
      }else{
            
            SuppliesModel.findOne({
                     "name":name,
                      "isactive": true,
                     "isdeleted": false
                  }, function (err, supplynameExist) { 
                  if(err) 
                  {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
                  }
                  else if(supplynameExist)
                  {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Supply name already exists",req.headers.responsetype));
                  }
                  else
                  {
                           var _supply = new SuppliesModel({
                                 'name': name,
                                 'addedby':addedby,
                                 'modifiedby':modifiedby
                           });
                           _supply.save(function(error) {        
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
   req.check('supplyid', 'Supply Id should not be blank.').notEmpty();
   req.check('supplyname', 'Name should not be blank.').notEmpty();
   req.check('userid', 'User should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _supplyid = req.body.supplyid;
   var name = req.body.supplyname;
   var modifiedby = req.body.userid; 
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
	
         return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
   }else{
	    
	    SuppliesModel.findOne({
                  "name":name,
                   "isactive": true,
                  "isdeleted": false,
                  '_id':{$ne:_supplyid}
	    }, function (err, supplyExist){
                     if (err) 
                     {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
                     }
                     else if(supplyExist)
                     {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Supply name already exist.",req.headers.responsetype));
                     }
                     else
                     {
			SuppliesModel.findOne({
			'_id':_supplyid
                                 }, function (error, findsupply) {
		    	    	    if (error) 
				    {
				       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
				    }
				    else if(findsupply)
				    {
					SuppliesModel.update({
						'_id': _supplyid
					},{
					    $set: {		
						    'name': name,
						    'modifiedby':modifiedby,
						    'modifieddate':modifieddate,
						    'isdeleted':isdeleted,
						    'isactive':isactive
					    }
					},function(errupdate, supplyupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
					});
				    }
				    else
				    {
				       return res.send(messages.CustomExceptionHandler("authorization", "Supply could not found!",req.headers.responsetype));
				    }
				});
		    }
	    });
    }
    
});

router.delete('/:supplyid',auth.authorize, function(req, res, next) {
    var _supplyid = req.params.supplyid;
    SuppliesModel.findOne({'_id':_supplyid},function(err, supplyExist){
	if (err) 
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
	else if(supplyExist)
	{
		SuppliesModel.update({
			    '_id': _supplyid
		},{
		    $set: {		
		      'isdeleted': true
		    }
		},function(errupdate, _supplyupdate) {
			if (errupdate)
			    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		});
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Supply could not found!",req.headers.responsetype));
	}
    });
});


module.exports = router;