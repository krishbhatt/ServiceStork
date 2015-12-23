var express = require('express');
var ServicePackageAddonsModel = require('../models/ServicePackageAddonsModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');

router.get('/', function(req, res, next) {
   ServicePackageAddonsModel.find({
        "isactive": true,
        "isdeleted": false
      }).populate(["servicepackage","service","duration","currency"]).exec(function(err, packageaddons) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", packageaddons,req.headers.responsetype));
   });  
});


router.get('/:id', function(req, res, next) {
   
   var _addonid = req.params.id;
   ServicePackageAddonsModel.findOne({
            "_id": _addonid
      }).populate(["servicepackage","service","duration","currency"]).exec(function(err, packageaddon) {
	
         if (err){
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else{
                  if (packageaddon == null) {
                      return res.send(messages.CustomExceptionHandler("authorization", 'Service package addon is not valid.',req.headers.responsetype));
                  }else{
                      return res.send(messages.CustomExceptionHandler("success", packageaddon,req.headers.responsetype));
                  }
	       
         }
      })
});


router.post('/', function(req, res, next) {
   
      req.check('name', 'Name should not be blank.').notEmpty();
      req.check('packageid', 'Package should not be blank.').notEmpty();
      req.check('serviceid', 'Service should not be blank.').notEmpty();
      req.check('durationid', 'Duration should not be blank.').notEmpty();
      req.check('currencyid', 'Currency should not be blank.').notEmpty();
      req.check('cost', 'Cost should be positive integer.').isInt();
      req.check('userid', 'User should not be blank.').notEmpty();
      var name = req.body.name;
      var packageid = req.body.packageid;
      var serviceid = req.body.serviceid;
      var durationid = req.body.durationid;
      var currencyid = req.body.currencyid;
      var cost = req.body.cost;
      var note = req.body.note;
      var addedby = req.body.userid;
      var modifiedby = req.body.userid;
      var errors = req.validationErrors();
      if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
      }else{
            
            ServicePackageAddonsModel.findOne({
                     "name" : name,
                     "servicepackage" : packageid,
                     "service" : serviceid,
                     "duration" : durationid,
                     "currency" : currencyid,
                      "isactive": true,
                     "isdeleted": false
                  }, function (err, packageAddonExist) { 
                  if(err) 
                  {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
                  }
                  else if(packageAddonExist)
                  {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service Package Addon already exists",req.headers.responsetype));
                  }
                  else
                  {
                           var _addon = new ServicePackageAddonsModel({
                                 'name': name,
                                 'servicepackage': packageid,
                                 'service': serviceid,
                                 'duration': durationid,
                                 'currency': currencyid,
                                 'cost': cost,
                                 'note': note,
                                 'addedby':addedby,
                                 'modifiedby':modifiedby
                           });
                           _addon.save(function(error) {        
                              if (error)        
                                       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
                              else
                                       return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
                           });
                  }
            });
      }
});


router.put('/', function(req, res, next) {
   req.check('addonid', 'Service package addon should not be blank.').notEmpty();
   req.check('name', 'Name should not be blank.').notEmpty();
   req.check('cost', 'Cost should be positive integer.').isInt();
   req.check('userid', 'User should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _addonid = req.body.addonid;
   var name = req.body.name;
   var packageid = req.body.packageid;
   var serviceid = req.body.serviceid;
   var durationid = req.body.durationid;
   var currencyid = req.body.currencyid;
   var cost = req.body.cost;
   var note = req.body.note;
   var modifiedby = req.body.userid; 
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
	
         return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
   }else{
	    
	    ServicePackageAddonsModel.findOne({
                  "name" : name,
                  "servicepackage" : packageid,
                  "service" : serviceid,
                  "duration" : durationid,
                  "currency" : currencyid,
                   "isactive": true,
                  "isdeleted": false,
                  '_id':{$ne:_addonid}
	    }, function (err, addonExist){
                     if (err) 
                     {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
                     }
                     else if(addonExist)
                     {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service package addon already exist.",req.headers.responsetype));
                     }
                     else
                     {
			ServicePackageAddonsModel.findOne({
			'_id':_addonid
                                 }, function (error, findaddon) {
		    	    	    if (error) 
				    {
				       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
				    }
				    else if(findaddon)
				    {
					ServicePackageAddonsModel.update({
						'_id': _addonid
					},{
					    $set: {
                                                      'name' : name,
                                                      'servicepackage': packageid,
                                                      'serviceid': serviceid,
                                                      'durationid': durationid,
                                                      'currencyid': currencyid,
                                                      'cost': cost,
                                                      'note': note,
                                                      'modifiedby':modifiedby,
                                                      'modifieddate':modifieddate,
                                                      'isdeleted':isdeleted,
                                                      'isactive':isactive
					    }
					},function(errupdate, addonupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
					});
				    }
				    else
				    {
					return res.send(messages.CustomExceptionHandler("authorization", "Service package addon could not found!",req.headers.responsetype));
				    }
				});
		    }
	    });
    }
    
});

router.delete('/:addonid', function(req, res, next) {
   var _addonid = req.params.addonid;
   ServicePackageAddonsModel.findOne({'_id':_addonid},function(err, addonExist){
         if (err) 
         {
               return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else if(addonExist)
         {
	       ServicePackageAddonsModel.update({
			   '_id': _addonid
	       },{
                     $set: {		
                        'isdeleted': true
                     }
	       },function(errupdate, _addonupdate) {
			if (errupdate)
			    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		});
         }
         else
         {
		return res.send(messages.CustomExceptionHandler("authorization", "Service package addon could not found!",req.headers.responsetype));
         }
    });
});


module.exports = router;