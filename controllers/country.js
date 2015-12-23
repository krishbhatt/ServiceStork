var express = require('express');
var CountriesModel = require('../models/CountriesModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');

router.get('/',auth.authorize,function(req, res, next) {
    CountriesModel.find({
        "isactive": true,
        "isdeleted": false
    }, function(err, countries) {
        if (err)
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
        else
	{
		return res.send(messages.CustomExceptionHandler("success", countries,req.headers.responsetype));
	}
    });
});

router.get('/:id',auth.authorize, function(req, res, next) {
    var _countryid = req.params.id;
    CountriesModel.findOne({
        "_id": _countryid
    }, function(err, country) {
        if (err)
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
        else
	{
		return res.send(messages.CustomExceptionHandler("success", country,req.headers.responsetype));
	}
    })
});

router.post('/',auth.authorize,function(req, res, next) {
	
	req.check('name', 'Name should not be blank.').notEmpty();
	req.check('userid', 'User should not be blank.').notEmpty();
	var name = req.body.name;
	var addedby = req.body.userid;
	var modifiedby = req.body.userid;
	var errors = req.validationErrors();
	if (errors) {
	    return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
	}else{
		CountriesModel.findOne({
			    "name":name,
			     "isactive": true,
        		"isdeleted": false
		    }, function (err, countryExist) { 
			if(err) 
			{
			    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
			}
			else if(countryExist)
			{
			    return res.send(messages.CustomExceptionHandler("duplicatecheck", "Country already exists.",req.headers.responsetype));
			}
			else
			{
			    var _newcountry = new CountriesModel({
				'name': name,
				'addedby':addedby,
				'modifiedby':modifiedby
			    });
			    _newcountry.save(function(error){        
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
    req.check('countryid', 'Country id should not be blank.').notEmpty();
    req.check('name', 'Name should not be blank.').notEmpty();
    req.check('userid', 'User should not be blank.').notEmpty();
    req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
    req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
    var _countryid = req.body.countryid;
    var name = req.body.countryname;
    var modifiedby = req.body.userid; 
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
    var isdeleted = req.body.isdeleted; 
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {
	return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
    
    }else{
	    
	    CountriesModel.findOne({
        "name":name,
         "isactive": true,
        "isdeleted": false,
        '_id':{$ne:_countryid}
    }, function (err, countryExist){
        if (err) 
        {
	    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
        }
        else if(countryExist)
        {
	    return res.send(messages.CustomExceptionHandler("duplicatecheck", "Country already exists.",req.headers.responsetype));
        }
        else
        {
           CountriesModel.findOne({
            '_id':_countryid
           }, function (error, findcountry) {
			  if (error) 
			  {
				return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype)); 
			  }
			  else if(findcountry)
			  {
				CountriesModel.update({
				'_id': _countryid
			    },{
				 $set: {		
				  'name': name,
				  'modifiedby':modifiedby,
				  'modifieddate':modifieddate,
				  'isdeleted':isdeleted,
				  'isactive':isactive
				 }
			    },function(errupdate, countryupdate) {
				  if (errupdate)       
				    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
				  else
					return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
			    });
			  }
			  else
			  {
				return res.send(messages.CustomExceptionHandler("authorization", "Country could not found!",req.headers.responsetype));
			  }
		   });
		}
	});
	
    }
    
});

router.delete('/:countryid',auth.authorize, function(req, res, next) {
    var _countryid = req.params.countryid;
	CountriesModel.findOne({'_id':_countryid},function(err,countryExist){
       if (err) 
       {
		return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
       }
       else if(countryExist)
       {
		   CountriesModel.update({
				'_id': _countryid
		   },{
			 $set: {		
			  'isdeleted': true
			 }
		   },function(errupdate, _countryupdate) {
			  if (errupdate)       
				return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype)); 
			  else
				return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		   });
       }
	   else
	   {
		return res.send(messages.CustomExceptionHandler("authorization", "Country could not found!",req.headers.responsetype));
	   }
	});
});



module.exports = router;