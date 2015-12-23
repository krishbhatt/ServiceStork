var express = require('express');
var CitiesModel = require('../models/CitiesModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');

router.get('/',auth.authorize,function(req, res, next) {
    CitiesModel.find({
        "isactive": true,
        "isdeleted": false
    }, function(err, cities) {
        if (err)
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
        else
	{
		return res.send(messages.CustomExceptionHandler("success", cities,req.headers.responsetype));
	}
    });
});

router.get('/:id',auth.authorize, function(req, res, next) {
    var _cityid = req.params.id;
    CitiesModel.findOne({
        "_id": _cityid
    }, function(err, city) {
        if (err)
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		}
        else
		{
			return res.send(messages.CustomExceptionHandler("success", city,req.headers.responsetype));
		}
    })
});


router.post('/',auth.authorize,function(req, res, next) {
	req.check('name', 'Name should not be blank.').notEmpty();
	req.check('countryid', 'Country should not be blank.').notEmpty();
	req.check('userid', 'User should not be blank.').notEmpty();
	var name = req.body.name;
	var countryid = req.body.countryid;
	var addedby = req.body.userid;
	var modifiedby = req.body.userid;
	var errors = req.validationErrors();
	if (errors) {
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
	}else{
	    
	    CitiesModel.findOne({
		    "name":name,
		     "isactive": true,
        	"isdeleted": false
	    }, function (err, cityExist) { 
		if(err) 
		{
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		}
		else if(cityExist)
		{
		    return res.send(messages.CustomExceptionHandler("duplicatecheck", "City already exists",req.headers.responsetype));
		}
		else
		{
			var _newcity = new CitiesModel({
			    'name': name,
			    'country': countryid,
			    'addedby': addedby,
			    'modifiedby': modifiedby
			});
			_newcity.save(function(error){        
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
    req.check('cityid', 'City id should not be blank.').notEmpty();
    req.check('name', 'Name should not be blank.').notEmpty();
    req.check('countryid', 'Country should not be blank.').notEmpty();
    req.check('userid', 'User should not be blank.').notEmpty();
    req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
    req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
    var _cityid = req.body.cityid;
    var name = req.body.cityname;
    var countryid = req.body.countryid;
    var modifiedby = req.body.userid; 
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
    var isdeleted = req.body.isdeleted; 
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {
	return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
    
    }else{
	
	CitiesModel.findOne({
        "name":name,
         "isactive": true,
        "isdeleted": false,
        '_id':{$ne:_cityid}
    }, function (err, cityExist){
        if (err) 
        {
	    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
        }
        else if(cityExist)
        {
	    return res.send(messages.CustomExceptionHandler("duplicatecheck", "City already exists",req.headers.responsetype));
        }
        else
        {
           CitiesModel.findOne({
            '_id':_cityid
           }, function (error, findcity) {
			  if (error) 
			  {
				return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype)); 
			  }
			  else if(findcity)
			  {
				CitiesModel.update({
				'_id': _cityid
			    },{
				 $set: {		
				  'name': name,
				  'country': countryid,
				  'modifiedby':modifiedby,
				  'modifieddate':modifieddate,
				  'isdeleted':isdeleted,
				  'isactive':isactive
				 }
			    },function(errupdate, cityupdate) {
				if (errupdate)
				    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype)); 
				else
				    return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
			    });
			  }
			  else
			  {
				return res.send(messages.CustomExceptionHandler("authorization", "City could not found!",req.headers.responsetype));
			  }
		   });
		}
	});
    }
    
});

router.delete('/:cityid',auth.authorize, function(req, res, next) {
    var _cityid = req.params.cityid;
	CitiesModel.findOne({'_id':_cityid},function(err,cityExist){
       if (err) 
       {
		   return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));  
       }
       else if(cityExist)
       {
		   CitiesModel.update({
				'_id': _cityid
		   },{
			 $set: {		
			  'isdeleted': true
			 }
		   },function(errupdate, _cityupdate) {
			  if (errupdate)       
				return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));  
			  else
				return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		   });
       }
	   else
	   {
		return res.send(messages.CustomExceptionHandler("authorization", "City could not found!",req.headers.responsetype));
	   }
	});
});



module.exports = router;