var express = require('express');
var ServiceRegionsModel = require('../models/ServiceRegionsModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');

router.get('/', function(req, res, next) {
   ServiceRegionsModel.find({
        "isactive": true,
        "isdeleted": false
      }).populate(["service","region"]).exec(function(err, serviceregions) {
         
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message));
         else
            return res.send(messages.CustomExceptionHandler("success", serviceregions));
   });  
});


router.get('/:id', function(req, res, next) {
   
   var _serviceregionid = req.params.id;
   ServiceRegionsModel.findOne({
            "_id": _serviceregionid
      }).populate(["service","region"]).exec(function(err, serviceregion) {
	
         if (err){
		  return res.send(messages.CustomExceptionHandler("systemerror", err.message));
         }
         else{
                  if (supply == null) {
                     return res.send(messages.CustomExceptionHandler("authorization", 'Service-region is not valid.'));
                  }else{
                     return res.send(messages.CustomExceptionHandler("success", serviceregion));
                  }
	       
         }
      })
});


router.post('/', function(req, res, next) {
      req.check('serviceid', 'Service id should not be blank.').notEmpty();
      req.check('regionid', 'Region id should not be blank.').notEmpty();
      req.check('userid', 'User id should not be blank.').notEmpty();
      var serviceid = req.body.serviceid;
      var regionid = req.body.regionid;
      var addedby = req.body.userid;
      var modifiedby = req.body.userid;
      var errors = req.validationErrors();
      if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors));
	
      }else{
            
            ServiceRegionsModel.findOne({
                     "serviceid": serviceid,
                     "regionid" : regionid
                  }, function (err, serviceRegionExist) { 
                  if(err) 
                  {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message));
                  }
                  else if(serviceRegionExist)
                  {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service-region already exists"));
                  }
                  else
                  {
                           var _serviceregion = new ServiceRegionsModel({
                                 'serviceid': serviceid,
                                 'regionid' : regionid,
                                 'addedby':addedby,
                                 'modifiedby':modifiedby
                           });
                           _serviceregion.save(function(error) {        
                              if (error)        
                                       return res.send(messages.CustomExceptionHandler("systemerror", error.message));
                              else
                                       return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted"));
                           });
                  }
            });
      }
});


router.put('/', function(req, res, next) {
   req.check('serviceregionid', 'Service-region id should not be blank.').notEmpty();
   req.check('serviceid', 'Service id should not be blank.').notEmpty();
   req.check('regionid', 'Region id should not be blank.').notEmpty();
   req.check('userid', 'User id should not be blank.').notEmpty();
   req.check('isdeleted', 'Delete status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _serviceregionid = req.body.serviceregionid;
   var serviceid = req.body.serviceid;
   var regionid = req.body.regionid;
   var modifiedby = req.body.userid; 
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
	
         return res.send(messages.CustomExceptionHandler("requiredparams", errors));
	
   }else{
	    
	    ServiceRegionsModel.findOne({
                  "serviceid": serviceid,
                  "regionid" : regionid,
                  '_id':{$ne:_serviceregionid}
	    }, function (err, serviceRegionExist){
                     if (err) 
                     {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message));  
                     }
                     else if(serviceRegionExist)
                     {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service-region already exist."));
                     }
                     else
                     {
			ServiceRegionsModel.findOne({
			'_id':_serviceregionid
                                 }, function (error, findserviceregion) {
		    	    	    if (error) 
				    {
				       return res.send(messages.CustomExceptionHandler("systemerror", error.message));  
				    }
				    else if(findserviceregion)
				    {
					ServiceRegionsModel.update({
						'_id': _serviceregionid
					},{
					    $set: {		
						    'serviceid': serviceid,
                                                    'regionid' : regionid,
						    'modifiedby':modifiedby,
						    'modifieddate':modifieddate,
						    'isdeleted':isdeleted,
						    'isactive':isactive
					    }
					},function(errupdate, serviceregionupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated."));
					});
				    }
				    else
				    {
					return res.send(messages.CustomExceptionHandler("authorization", "Service-region could not found!"));
				    }
				});
		    }
	    });
    }
    
});

router.delete('/:userid', function(req, res, next) {
    var _serviceregionid = req.params.serviceregionid;
    ServiceRegionsModel.findOne({'_id':_serviceregionid},function(err, serviceRegionExist){
	if (err) 
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message));
	}
	else if(serviceRegionExist)
	{
		ServiceRegionsModel.update({
			    '_id': _serviceregionid
		},{
		    $set: {		
		      'isdeleted': true
		    }
		},function(errupdate, _serviceregionupdate) {
			if (errupdate)
			    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message));
			else
			    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted."));
		});
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Service-region could not found!"));
	}
    });
});


module.exports = router;