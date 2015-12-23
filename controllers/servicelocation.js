var express = require('express');
var ServiceLocationTypesModel = require('../models/ServiceLocationTypesModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');

router.get('/',auth.authorize, function(req, res, next) {
   ServiceLocationTypesModel.find({
        "isactive": true,
        "isdeleted": false
      }, function(err, servicelocations) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", servicelocations,req.headers.responsetype));
   });  
});


router.get('/:id',auth.authorize, function(req, res, next) {
   
   var _servicelocationid = req.params.id;
   ServiceLocationTypesModel.findOne({
            "_id": _servicelocationid
      }, function(err, servicelocation) {
	
         if (err){
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else{
                  if (servicelocation == null) {
                     return res.send(messages.CustomExceptionHandler("authorization", 'Service Location is not valid.',req.headers.responsetype));
                  }else{
                     return res.send(messages.CustomExceptionHandler("success", servicelocation,req.headers.responsetype));
                  }
	       
         }
      })
});


router.post('/',auth.authorize, function(req, res, next) {
      req.check('name', 'Service Location name should not be blank.').notEmpty();
      req.check('userid', 'User should not be blank.').notEmpty();
      var name = req.body.name;
      var addedby = req.body.userid;
      var modifiedby = req.body.userid;
      var errors = req.validationErrors();
      if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
      }else{
            
            ServiceLocationTypesModel.findOne({
                     "name":name,
                      "isactive": true,
                     "isdeleted": false
                  }, function (err, serviceLocationExist) { 
                  if(err) 
                  {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
                  }
                  else if(serviceLocationExist)
                  {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service Location already exists",req.headers.responsetype));
                  }
                  else
                  {
                           var _servicelocation = new ServiceLocationTypesModel({
                                 'name': name,
                                 'addedby':addedby,
                                 'modifiedby':modifiedby
                           });
                           _servicelocation.save(function(error) {        
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
   req.check('servicelocationid', 'Service Location id should not be blank.').notEmpty();
   req.check('name', 'Service Location name should not be blank.').notEmpty();
   req.check('userid', 'User should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _servicelocationid = req.body.servicelocationid;
   var name = req.body.name;
   var modifiedby = req.body.userid; 
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
	
         return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
   }else{
	    
	    ServiceLocationTypesModel.findOne({
                  "name":name,
                   "isactive": true,
                  "isdeleted": false,
                  '_id':{$ne:_servicelocationid}
	    }, function (err, serviceLocationExist){
                     if (err) 
                     {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));  
                     }
                     else if(serviceLocationExist)
                     {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service Location already exist.",req.headers.responsetype));
                     }
                     else
                     {
			ServiceLocationTypesModel.findOne({
			'_id':_servicelocationid
                                 }, function (error, findservicelocation) {
		    	    	    if (error) 
				    {
				       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
				    }
				    else if(findservicelocation)
				    {
					ServiceLocationTypesModel.update({
						'_id': _servicelocationid
					},{
					    $set: {		
						    'name': name,
                                                    'modifiedby':modifiedby,
						    'modifieddate':modifieddate,
						    'isdeleted':isdeleted,
						    'isactive':isactive
					    }
					},function(errupdate, servicelocationupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
					});
				    }
				    else
				    {
					return res.send(messages.CustomExceptionHandler("authorization", "Service Location could not found!",req.headers.responsetype));
				    }
				});
		    }
	    });
    }
    
});

router.delete('/:servicelocationid',auth.authorize, function(req, res, next) {
    var _servicelocationid = req.params.servicelocationid;
    ServiceLocationTypesModel.findOne({'_id':_servicelocationid},function(err, serviceLocationExist){
	if (err)
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
	else if(serviceLocationExist)
	{
		ServiceLocationTypesModel.update({
			    '_id': _servicelocationid
		},{
		    $set: {		
		      'isdeleted': true
		    }
		},function(errupdate, _servicelocationupdate) {
			if (errupdate)
			   return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			   return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		});
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Service Location could not found!",req.headers.responsetype));
	}
    });
});


module.exports = router;