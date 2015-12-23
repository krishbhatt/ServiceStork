var express = require('express');
var CustomersModel = require('../models/CustomersModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');



router.get('/',function(req, res, next) {
   CustomersModel.find({	    
        "isactive": true,
        "isdeleted": false
    }).populate(["customertype","customersubtype","region","subregion","customeraddress.addresstypeid"]).exec(function(err, customers) {
         if (err)
         {
	       return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else
         {
	       return res.send(messages.CustomExceptionHandler("success", customers,req.headers.responsetype));
         }
    }); 
});



router.get('/:id', function(req, res, next) {
   
   var _customerid = req.params.id;
    CustomersModel.findOne({	 
	 "_id": _customerid,   
        "isactive": true,
        "isdeleted": false
    }).populate(["customertype","customersubtype","region","subregion","customeraddress.addresstypeid"]).exec(function(err, customer){
	
         if (err){
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else{
                  if (customer == null) {
                      return res.send(messages.CustomExceptionHandler("authorization", 'Customer id is not valid.',req.headers.responsetype));
                  }else{
                      return res.send(messages.CustomExceptionHandler("success", customertype));
                  }
	       
         }
      })
});
 

router.post('/', function(req, res, next) {
      req.check('email', 'Email should not be blank.').notEmpty();
      req.check('userid', 'User should not be blank.').notEmpty();
	  
	  var userid = req.body.userid;
      var customertype = req.body.customertype;
	  var customersubtype=req.body.customersubtype;
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
	  var imagename = req.body.imagename;
      var gender = req.body.gender;
	  var email=req.body.email;
      var emailpreferenceforcommunication = req.body.emailpreferenceforcommunication;
      var phonepreferenceforcommunication = req.body.phonepreferenceforcommunication;  
	  var messagepreferenceforcommunication = req.body.messagepreferenceforcommunication;
	  var region=req.body.region;
      var subregion = req.body.subregion;
      var rating = req.body.rating;
	  var longitude = req.body.longitude;
      var latitude = req.body.latitude;
	  var note=req.body.note;
      var details = req.body.details;
      var customeraddress = req.body.customeraddress;
	  var isauthorised = req.body.isauthorised;
      var errors = req.validationErrors();
      if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
      }else{
            
            CustomersModel.findOne({
                     "email": email,
                      "isactive": true,
                     "isdeleted": false
                  }, function (err, customernameExist) { 
                  if(err) 
                  {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
                  }
                  else if(customernameExist)
                  {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Customer Email already exists",req.headers.responsetype));
                  }
                  else
                  {
                           var _customer = new CustomersModel({
                                 'userid': userid,
                                 'customertype':customertype,
                                 'customersubtype':customersubtype,
								 'firstname': firstname,
                                 'lastname':lastname,
                                 'imagename':imagename,
								 'gender': gender,
                                 'email':email,
                                 'emailpreferenceforcommunication':emailpreferenceforcommunication,
								 'phonepreferenceforcommunication': phonepreferenceforcommunication,
                                 'messagepreferenceforcommunication':messagepreferenceforcommunication,
                                 'region':region,
								 'subregion': subregion,
								 "rating":rating,
                                 'longitude':longitude,
                                 'latitude':latitude,
								 'note': note,
                                 'details':details,
                                 'customeraddress':customeraddress,
								 'isauthorised':isauthorised
								 
                           });
                           _customer.save(function(error) {        
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
	   req.check('customerid', 'Customer Type Id should not be blank.').notEmpty();
	   req.check('email', 'Email should not be blank.').notEmpty();
	   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
	   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
	   var _customerid = req.body.customerid;		  
	  var userid = req.body.userid;
      var customertype = req.body.customertype;
	  var customersubtype=req.body.customersubtype;
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
	  var imagename = req.body.imagename;
      var gender = req.body.gender;
	  var email=req.body.email;
      var emailpreferenceforcommunication = req.body.emailpreferenceforcommunication;
      var phonepreferenceforcommunication = req.body.phonepreferenceforcommunication;  
	  var messagepreferenceforcommunication = req.body.messagepreferenceforcommunication;
	  var region=req.body.region;
      var subregion = req.body.subregion;
      var rating = req.body.rating;
	  var longitude = req.body.longitude;
      var latitude = req.body.latitude;
	  var note=req.body.note;
      var details = req.body.details;
      var customeraddress = req.body.customeraddress;
	  var isauthorised = req.body.isauthorised;
   
   
   var errors = req.validationErrors();
   if (errors) {
	
         return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
   }else{
	    
	    CustomersModel.findOne({
                  "email": email,
                   "isactive": true,
                  "isdeleted": false,
                  '_id':{$ne:_customerid}
	    }, function (err, customerExist){
                     if (err) 
                     {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
                     }
                     else if(customerExist)
                     {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Customer name  already exist.",req.headers.responsetype));
                     }
                     else
                     {
			CustomersModel.findOne({
			'_id':_customerid
                                 }, function (error, findcustomer) {
		    	    	    if (error) 
				    {
				       return res.send(messages.CustomExceptionHandler("systemerror", error.message));  
				    }
				    else if(findcustomer)
				    {
					CustomersModel.update({
						'_id': _customerid
					},{
					    $set: {		
						    'userid': userid,
                                 'customertype':customertype,
                                 'customersubtype':customersubtype,
								 'firstname': firstname,
                                 'lastname':lastname,
                                 'imagename':imagename,
								 'gender': gender,
                                 'email':email,
                                 'emailpreferenceforcommunication':emailpreferenceforcommunication,
								 'phonepreferenceforcommunication': phonepreferenceforcommunication,
                                 'messagepreferenceforcommunication':messagepreferenceforcommunication,
                                 'region':region,
								 'subregion': subregion,
								  "rating":rating,
                                 'longitude':longitude,
                                 'latitude':latitude,
								 'note': note,
                                 'details':details,
                                 'customeraddress':customeraddress,
								 'isauthorised':isauthorised,
						         'modifieddate':modifieddate,
						         'isdeleted':isdeleted,
						          'isactive':isactive
					    }
					},function(errupdate, customerupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
					});
				    }
				    else
				    {
				       return res.send(messages.CustomExceptionHandler("authorization", "Customer could not found!",req.headers.responsetype));
				    }
				});
		    }
	    });
    }
    
});

router.delete('/:customerid', function(req, res, next) {
    var _customerid = req.params.customerid;
    CustomersModel.findOne({'_id':_customerid},function(err, customerExist){
	if (err) 
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message));
	}
	else if(customerExist)
	{
		CustomersTypesModel.update({
			    '_id': _customerid
		},{
		    $set: {		
		      'isdeleted': true
		    }
		},function(errupdate, _customerupdate) {
			if (errupdate)
			    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		});
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Customer could not found!",req.headers.responsetype));
	}
    });
});


module.exports = router;