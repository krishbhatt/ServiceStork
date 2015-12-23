var express = require('express');
var ServicesModel = require('../models/ServicesModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');


router.post('/',auth.authorize,function(req, res, next) {
   req.check('servicename', 'Service name should not be blank.').notEmpty();
   req.check('regions', 'Region should not be blank.').notEmpty();
   req.check('userid', 'User should not be blank.').notEmpty();
   var name = req.body.servicename;
   var serviceimage=req.body.serviceimage;
   var regions = req.body.regions;
   var servicepackages=req.body.servicepackages;
   
   
   
   var addedby = req.body.userid;
   var modifiedby = req.body.userid;
   var errors = req.validationErrors();
   if (errors) {
      return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
   
   }else{
         
      ServicesModel.findOne({
            "name":name,
             "isactive": true,
            "isdeleted": false
         }, function (err, servicenameExist) { 
            if(err) 
            {
               return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
            }
            else if(servicenameExist)
            {
               return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service already exists",req.headers.responsetype));
            }
            else
            {
             var _service = new ServicesModel({
			'name': name,
			'serviceimage': serviceimage,
			'servicepackages':servicepackages,
         	'regions':regions,
			'addedby':addedby,
			'modifiedby':modifiedby
                  });
                  _service.save(function(error) {        
                     if (error)        
			return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
		     else
                        return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
                  });
            }
         });
   }
    
});


router.get('/',auth.authorize,function(req, res, next) {
   ServicesModel.find({	    
        "isactive": true,
        "isdeleted": false
    }).populate(["regions","servicepackages.region","servicepackages.locationtype","servicepackages.duration","servicepackages.currency","servicepackages.servicepackageaddons.duration","servicepackages.servicepackageaddons.currency"]).exec(function(err, services) {
         if (err)
         {
	       return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else
         {
	       return res.send(messages.CustomExceptionHandler("success", services,req.headers.responsetype));
         }
    }); 
});

router.get('/:id', auth.authorize,function(req, res, next) {
   var _serviceid = req.params.id;
   ServicesModel.findOne({
	     "_id": _serviceid,
        "isactive": true,
        "isdeleted": false
    }).populate(["regions","servicepackages.region","servicepackages.locationtype","servicepackages.duration","servicepackages.currency","servicepackages.servicepackageaddons.duration","servicepackages.servicepackageaddons.currency"]).exec(function(err, service) {
      if (err)
      {
              return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
      }
      else
      {
              return res.send(messages.CustomExceptionHandler("success", service,req.headers.responsetype));
      }
   }); 
});




router.put('/',auth.authorize, function(req, res, next) {
   
   req.check('serviceid', 'Service id should not be blank.').notEmpty();
   req.check('regions', 'Region should not be blank.').notEmpty();
   req.check('servicename', 'Service name should not be blank.').notEmpty();
   req.check('userid', 'User should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _serviceid = req.body.serviceid;
   var name = req.body.servicename;
   var serviceimage=req.body.serviceimage;
   var regions = req.body.regions;
   var servicepackages=req.body.servicepackages;
   var modifiedby = req.body.userid;
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
      return res.send(messages.CustomExceptionHandler("requiredparams", errors));
   
   }else{
	    ServicesModel.findOne({
		    "name":name,
        "isactive": true,
        "isdeleted": false,
		    '_id':{$ne:_serviceid}
		}, function (err, serviceExist){
		    if (err) 
		    {
			    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
		    }
		    else if(serviceExist)
		    {
			    return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service already exists",req.headers.responsetype));
		    }
		    else
		    {
			    ServicesModel.findOne({
				    '_id':_serviceid
				}, function (error, findservice) {
					if (error) 
					{
						return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
					}
					else if(findservice)
					{
					    ServicesModel.update({
						'_id': _serviceid
					    },{
						$set: {		
							'name': name,
                             'serviceimage': serviceimage,
							 'regions':regions,
			    		    'servicepackages':servicepackages,
							'modifiedby':modifiedby,
							'modifieddate':modifieddate,
							'isdeleted':isdeleted,
							'isactive':isactive
						    }
					    },function(errupdate, servicepdate) {
						if (errupdate)
						   return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
						else
						   return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
						});
					}
					else
					{
						return res.send(messages.CustomExceptionHandler("authorization", "Service could not found!",req.headers.responsetype));
					}
			    });
		}
	});
    }
});


router.delete('/:serviceid',auth.authorize, function(req, res, next) {
    var _serviceid = req.params.serviceid;
    ServicesModel.findOne({'_id':_serviceid},function(err,serviceExist){
	if (err) 
	{
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
	else if(serviceExist)
	{
		ServicesModel.update({
				'_id': _serviceid
			},{
			$set: {		
			    'isdeleted': true
			}
		    },function(errupdate, serviceupdate) {
			if (errupdate)       
				return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
				return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		    });
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Service could not found!",req.headers.responsetype));
	}
    });
});

module.exports = router;