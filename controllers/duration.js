var express = require('express');
var DurationsModel = require('../models/DurationsModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');

router.get('/',auth.authorize, function(req, res, next) {
   DurationsModel.find({
        "isactive": true,
        "isdeleted": false
      }, function(err, durations) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", durations,req.headers.responsetype));
   });  
});


router.get('/:id',auth.authorize, function(req, res, next) {
   
   var _durationid = req.params.id;
   DurationsModel.findOne({
            "_id": _durationid
      }, function(err, duration) {
	
         if (err){
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else{
                  if (duration == null) {
                     return res.send(messages.CustomExceptionHandler("authorization", 'Duration is not valid.',req.headers.responsetype));
                  }else{
                     return res.send(messages.CustomExceptionHandler("success", duration));
                  }
	       
         }
      })
});


router.post('/',auth.authorize, function(req, res, next) {
      req.check('servicedurationinminute', 'Service duration must be integer value.').notEmpty().isInt();
      req.check('note', 'Note should not be blank.').notEmpty();
      req.check('userid', 'User should not be blank.').notEmpty();
      var servicedurationinminute = req.body.servicedurationinminute;
      var note = req.body.note;
      var addedby = req.body.userid;
      var modifiedby = req.body.userid;
      var errors = req.validationErrors();
      if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
      }else{
            
            DurationsModel.findOne({
                     "servicedurationinminute":servicedurationinminute,
                      "isactive": true,
                     "isdeleted": false
                  }, function (err, durationExist) { 
                  if(err) 
                  {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
                  }
                  else if(durationExist)
                  {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Duration already exists.",req.headers.responsetype));
                  }
                  else
                  {
                           var _duration = new DurationsModel({
                                 'servicedurationinminute': servicedurationinminute,
                                 'note' : note,
                                 'addedby':addedby,
                                 'modifiedby':modifiedby
                           });
                           _duration.save(function(error) {        
                              if (error)        
                                       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
                              else
                                       return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted.",req.headers.responsetype));
                           });
                  }
            });
      }
});


router.put('/',auth.authorize, function(req, res, next) {
   req.check('durationid', 'Duration id should not be blank.').notEmpty().isInt();
   req.check('servicedurationinminute', 'Service duration must be integer value.').notEmpty().isInt();
   req.check('note', 'Note should not be blank.').notEmpty();
   req.check('userid', 'User should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _durationid = req.body.durationid;
   var servicedurationinminute = req.body.servicedurationinminute;
   var note = req.body.note;
   var modifiedby = req.body.userid; 
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
	
         return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
   }else{
	    
	    DurationsModel.findOne({
                  "servicedurationinminute":servicedurationinminute,
                   "isactive": true,
                  "isdeleted": false,
                  '_id':{$ne:_durationid}
	    }, function (err, durationExist){
                     if (err) 
                     {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
                     }
                     else if(durationExist)
                     {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Duration already exist.",req.headers.responsetype));
                     }
                     else
                     {
			DurationsModel.findOne({
			'_id':_durationid
                                 }, function (error, findduration) {
		    	    	    if (error) 
				    {
				       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
				    }
				    else if(findduration)
				    {
					DurationsModel.update({
						'_id': _durationid
					},{
					    $set: {		
						    'servicedurationinminute': servicedurationinminute,
                                                    'note' : note,
						    'modifiedby':modifiedby,
						    'modifieddate':modifieddate,
						    'isdeleted':isdeleted,
						    'isactive':isactive
					    }
					},function(errupdate, durationupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
					});
				    }
				    else
				    {
					return res.send(messages.CustomExceptionHandler("authorization", "Duration could not found!",req.headers.responsetype));
				    }
				});
		    }
	    });
    }
    
});

router.delete('/:durationid',auth.authorize, function(req, res, next) {
    var _durationid = req.params.durationid;
    DurationsModel.findOne({'_id':_durationid},function(err, durationExist){
	if (err) 
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
	else if(durationExist)
	{
		DurationsModel.update({
			    '_id': _durationid
		},{
		    $set: {		
		      'isdeleted': true
		    }
		},function(errupdate, _durationupdate) {
			if (errupdate)
			   return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			   return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		});
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Duration could not found!",req.headers.responsetype));
	}
    });
});


module.exports = router;