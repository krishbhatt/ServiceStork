var express = require('express');
var ServicePackagesModel = require('../models/ServicePackagesModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');

router.get('/',auth.authorize, function(req, res, next) {
   ServicePackagesModel.find({
        "isactive": true,
        "isdeleted": false
      }).populate(["region","service","locationtype","duration","currency"]).exec(function(err, packageservices) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", packageservices,req.headers.responsetype));
   });  
});


router.get('/:id',auth.authorize, function(req, res, next) {
   
   var _packageid = req.params.id;
   ServicePackagesModel.findOne({
            "_id": _packageid
      }).populate(["region","service","locationtype","duration","currency"]).exec(function(err, packageservice) {
	
         if (err){
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else{
                  if (packageservice == null) {
                      return res.send(messages.CustomExceptionHandler("authorization", 'Service package is not valid.',req.headers.responsetype));
                  }else{
                      return res.send(messages.CustomExceptionHandler("success", packageservice,req.headers.responsetype));
                  }
	       
         }
      })
});


router.post('/',auth.authorize, function(req, res, next) {
      req.check('name', 'Package name should not be blank.').notEmpty();
      req.check('regionid', 'Region should not be blank.').notEmpty();
      req.check('serviceid', 'Service should not be blank.').notEmpty();
      req.check('durationid', 'Duration should not be blank.').notEmpty();
      req.check('locationtypeid', 'Location should not be blank.').notEmpty();
      req.check('currencyid', 'Currency should not be blank.').notEmpty();
      req.check('cost', 'Cost should be positive integer.').isInt();
      req.check('userid', 'User should not be blank.').notEmpty();
      var name = req.body.name;
      var regionid = req.body.regionid;
      var serviceid = req.body.serviceid;
      var durationid = req.body.durationid;
      var currencyid = req.body.currencyid;
      var locationtypeid = req.body.locationtypeid;
      var cost = req.body.cost;
      var note = req.body.note;
      var addedby = req.body.userid;
      var modifiedby = req.body.userid;
      var errors = req.validationErrors();
      if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
      }else{
            
            ServicePackagesModel.findOne({
                     "name" : name,
                     "region" : regionid,
                     "service" : serviceid,
                     "duration" : durationid,
                     "currency" : currencyid,
                     "locationtype" : locationtypeid,
                      "isactive": true,
                     "isdeleted": false
                  }, function (err, packageExist) { 
                  if(err) 
                  {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
                  }
                  else if(packageExist)
                  {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service package already exists",req.headers.responsetype));
                  }
                  else
                  {
                           var _package = new ServicePackagesModel({
                                 'name' : name,
                                 'region': regionid,
                                 'service': serviceid,
                                 'duration': durationid,
                                 'currency': currencyid,
                                 'locationtype' : locationtypeid,
                                 'cost': cost,
                                 'note': note,
                                 'addedby':addedby,
                                 'modifiedby':modifiedby
                           });
                           _package.save(function(error) {        
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
   req.check('packageid', 'Service package should not be blank.').notEmpty();
   req.check('name', 'Package name should not be blank.').notEmpty();
   req.check('serviceid', 'Service should not be blank.').notEmpty();
   req.check('regionid', 'Region should not be blank.').notEmpty();
   req.check('durationid', 'Duration should not be blank.').notEmpty();
   req.check('locationtypeid', 'Location should not be blank.').notEmpty();
   req.check('currencyid', 'Currency should not be blank.').notEmpty();
   req.check('cost', 'Cost should be positive integer.').isInt();
   req.check('userid', 'User should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _packageid = req.body.packageid;
   var name = req.body.name;
   var serviceid = req.body.serviceid;
   var regionid = req.body.regionid;
   var locationtypeid = req.body.locationtypeid;
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
	    
	    ServicePackagesModel.findOne({
                  "name" : name,
                  "region" : regionid,
                  "service" : serviceid,
                  "duration" : durationid,
                  "currency" : currencyid,
                  "locationtype" : locationtypeid,
                   "isactive": true,
                  "isdeleted": false,
                  '_id':{$ne:_packageid}
	    }, function (err, packageExist){
                     if (err) 
                     {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
                     }
                     else if(packageExist)
                     {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service package already exist.",req.headers.responsetype));
                     }
                     else
                     {
			ServicePackagesModel.findOne({
			'_id':_packageid
                                 }, function (error, findpackage) {
		    	    	    if (error) 
				    {
				       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
				    }
				    else if(findpackage)
				    {
					ServicePackagesModel.update({
						'_id': _packageid
					},{
					    $set: {		
                                                      'name' : name,
                                                      'region': regionid,
                                                      'service': serviceid,
                                                      'duration': durationid,
                                                      'currency': currencyid,
                                                      'cost': cost,
                                                      'note': note,
                                                      'modifiedby':modifiedby,
                                                      'modifieddate':modifieddate,
                                                      'isdeleted':isdeleted,
                                                      'isactive':isactive
					    }
					},function(errupdate, packageupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
					});
				    }
				    else
				    {
					return res.send(messages.CustomExceptionHandler("authorization", "Service package could not found!",req.headers.responsetype));
				    }
				});
		    }
	    });
    }
    
});

router.delete('/:packageid',auth.authorize, function(req, res, next) {
   var _packageid = req.params.packageid;
   ServicePackagesModel.findOne({'_id':_packageid},function(err, servicePackageExist){
         if (err) 
         {
               return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else if(servicePackageExist)
         {
	       ServicePackagesModel.update({
			   '_id': _packageid
	       },{
                     $set: {		
                        'isdeleted': true
                     }
	       },function(errupdate, _packageupdate) {
			if (errupdate)
			    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		});
         }
         else
         {
		return res.send(messages.CustomExceptionHandler("authorization", "Service package could not found!",req.headers.responsetype));
         }
    });
});


module.exports = router;