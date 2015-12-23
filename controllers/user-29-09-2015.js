var express = require('express');
var UsersModel = require('../models/UsersModel');
var router = express.Router();
var moment = require('moment-timezone');
var md5 = require('MD5');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');

router.get('/', function(req, res, next) {
    UsersModel.find({
	
        "isactive": true,
        "isdeleted": false
    }).populate("userrole").exec(function(err, users) {
        if (err)
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message));
		}
        else
		{
			return res.send(messages.CustomExceptionHandler("success", users));
		}
    });
});


router.get('/:id', function(req, res, next) {
    //req.check('name', 'Name should not be blank.').notEmpty();
    var _userid = req.params.id;
    UsersModel.findOne({
        "_id": _userid
    }).populate("userrole").exec(function(err, user) {
	
        if (err){
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message));
	}
        else{
		    if (user == null) {
			return res.send(messages.CustomExceptionHandler("authorization", 'User id is not valid.'));
		    }else{
			return res.send(messages.CustomExceptionHandler("success", user));
		    }
		    
	}
    })
});


router.post('/', function(req, res, next) {
	req.check('name', 'Name should not be blank.').notEmpty();
	req.check('userrole', 'User Role should not be blank.').notEmpty();
	req.check('email', 'Email is not valid.').notEmpty().isEmail();
	req.check('password', 'Password should be 6 to 20 characters.').notEmpty().len(6, 20);
	req.check('user', 'User should not be blank.').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
	    
	    return res.send(messages.CustomExceptionHandler("requiredparams", errors));
	
	}else{
	    var name = req.body.name;
	    var userroleid = req.body.userrole;
	    var mailid = req.body.email;
	    var password = md5(req.body.password);
	    var addedby = req.body.user;
	    var modifiedby = req.body.user;
	    UsersModel.findOne({
		"name":name
	    }, function (err, userExist) { 
		if(err) 
		{
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message));
		}
		else if(userExist)
		{
		    return res.send(messages.CustomExceptionHandler("duplicatecheck", "User already exists"));
		}
		else
		{
		    var _newuser = new UsersModel({
					'name': name,
					'userrole' : userroleid,
					'mailid' : mailid,
					'password' : password,
					'addedby':addedby,
					'modifiedby':modifiedby
		    });
		    _newuser.save(function(error){        
			if (error)
			    return res.send(messages.CustomExceptionHandler("systemerror", error.message));
			else
			    return res.send(messages.CustomExceptionHandler("success", "User Successfully Inserted"));
		    });
		}
	    });
	}
	
});


router.put('/', function(req, res, next) {
    req.check('userid', 'user Id should not be blank.').notEmpty();
    req.check('name', 'Name should not be blank.').notEmpty();
    req.check('userrole', 'User Role should not be blank.').notEmpty();
    req.check('email', 'Email is not valid.').notEmpty().isEmail();
    req.check('password', 'Password should be 6 to 20 characters.').notEmpty().len(6, 20);
    req.check('user', 'User should not be blank.').notEmpty();
    req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
    req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
    var _userid = req.body.userid;
    var name = req.body.name;
    var userroleid = req.body.userrole;
    var mailid = req.body.email;
    var password = md5(req.body.password);
    var modifiedby = req.body.user; 
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
    var isdeleted = req.body.isdeleted; 
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {
	
	return res.send(messages.CustomExceptionHandler("requiredparams", errors));
	
    }else{
	    
	    UsersModel.findOne({
		"name":name,
		'_id':{$ne:_userid}
	    }, function (err, userExist){
		    if (err) 
		    {
		       return res.send(messages.CustomExceptionHandler("systemerror", error.message));  
		    }
		    else if(userExist)
		    {
		       return res.send(messages.CustomExceptionHandler("duplicatecheck", "User already exist."));
		    }
		    else
		    {
			UsersModel.findOne({
			'_id':_userid
				}, function (error, finduser) {
		    	    	    if (error) 
				    {
					return res.send(messages.CustomExceptionHandler("systemerror", error.message));  
				    }
				    else if(finduser)
				    {
					UsersModel.update({
						'_id': _userid
					},{
					    $set: {		
						    'name': name,
						    'userrole' : userroleid,
						    'mailid' : mailid,
						    'password' : password,
						    'modifiedby':modifiedby,
						    'modifieddate':modifieddate,
						    'isdeleted':isdeleted,
						    'isactive':isactive
					    }
					},function(errupdate, userupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message));
					    else
						return res.send(messages.CustomExceptionHandler("success", "User successfully updated."));
					});
				    }
				    else
				    {
					return res.send(messages.CustomExceptionHandler("authorization", "User could not found!"));
				    }
				});
		    }
	    });
    }
    
});


router.delete('/:userid', function(req, res, next) {
    var _userid = req.params.userid;
    UsersModel.findOne({'_id':_userid},function(err, userExist){
	if (err) 
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message));
	}
	else if(userExist)
	{
		UsersModel.update({
			    '_id': _userid
		},{
		    $set: {		
		      'isdeleted': true
		    }
		},function(errupdate, _userupdate) {
			if (errupdate)
			    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message));
			else
			    return res.send(messages.CustomExceptionHandler("success", "User successfully deleted."));
		});
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "User could not found!"));
	}
    });
});



module.exports = router;