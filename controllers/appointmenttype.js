var express = require('express');
var AppointmentTypesModel = require('../models/AppointmentTypesModel');
var router = express.Router();
var moment = require('moment-timezone');
var auth = require('../config/auth');
var messages = require('../messages.js');
var xml = require('xml');
router.get('/',auth.authorize, function(req, res, next) {
    AppointmentTypesModel.find({
        "isactive": true,
        "isdeleted": false
    }, function(err, appointmenttypes) {
       if (err)        
             return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
        else
             return res.send(messages.CustomExceptionHandler("success", appointmenttypes,req.headers.responsetype));
    });
});

router.get('/:id',auth.authorize, function(req, res, next) {
    var _appointmenttypeid = req.params.id;
    AppointmentTypesModel.findOne({
        "_id": _appointmenttypeid
    }, function(err, appointmenttype) {       
        if (err)        
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
        else
             return res.send(messages.CustomExceptionHandler("success", appointmenttype,req.headers.responsetype));
    })
});	
	
router.post('/',auth.authorize, function(req, res, next) {	
    var appointmentypename = req.body.appointmentypename;
    var addedby = req.body.userid;
    var modifiedby = req.body.userid;
    AppointmentTypesModel.findOne({
       "appointmentypename":appointmentypename,
        "isactive": true,
        "isdeleted": false
    }, function (err, appointmentypenameExist) { 
       if(err) 
       {
         return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
       }
       else if(appointmentypenameExist)
       {
		   return res.send(messages.CustomExceptionHandler("duplicatecheck", "Appointment type already exists",req.headers.responsetype));
	   }
	   else
	   {
		 var _appointmenttype = new AppointmentTypesModel({
			'appointmentypename': appointmentypename,
			'addedby':addedby,
			'modifiedby':modifiedby
		 });
		 _appointmenttype.save(function(error) {        
		   if (error)        
				  return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
                       else
                  return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
		 });
       }
	});
});

router.put('/',auth.authorize,function(req, res, next) {									
    var _appointmenttypeid = req.body.appointmenttypeid;
	var appointmentypename = req.body.appointmentypename;   
    var modifiedby = req.body.userid; 
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
    var isdeleted = req.body.isdeleted; 
	var isactive = req.body.isactive; 

	AppointmentTypesModel.findOne({
        "appointmentypename":appointmentypename,
         "isactive": true,
        "isdeleted": false,
        '_id':{$ne:_appointmenttypeid}
    }, function (err, appointmentypenameExist){
        if (err) 
        {
		   return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));   
        }
        else if(appointmentypenameExist)
        {
			return res.send(messages.CustomExceptionHandler("duplicatecheck", "Appointment type already exists",req.headers.responsetype));
		
        }
        else
        {
			AppointmentTypesModel.update({
				'_id': _appointmenttypeid
			}, {
				$set: {		
				 'appointmentypename': appointmentypename,
				 'modifiedby':modifiedby,
				 'modifieddate':modifieddate,
			     'isdeleted':isdeleted,
				 'isactive':isactive
				}
			}, function(errupdate, appointmenttypeupdate) {
				 if (errupdate)        
					return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
			});
		}
	});
});

router.delete('/:id',auth.authorize,function(req, res, next) {
    var _appointmenttypeid = req.params.id;
    AppointmentTypesModel.findOne({'_id':_appointmenttypeid},function(err,appointmenttypeExist){
       if (err) 
       {
		  return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
       }
       else if(appointmenttypeExist)
       {
		   AppointmentTypesModel.update({
				'_id': _appointmenttypeid
		   },{
			 $set: {		
			  'isdeleted': true
			 }
		   },function(errupdate, appointmenttypeupdate) {
			  if (errupdate)       
				  return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			   return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		   });
       }
	   else
	   {
		   return res.send(messages.CustomExceptionHandler("authorization", "Appointment type could not found!",req.headers.responsetype));
		 
	   }
	});
});



module.exports = router;