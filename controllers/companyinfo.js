var express = require('express');
var CompanyInfoModel = require('../models/CompanyInfoModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');
router.get('/',auth.authorize, function(req, res, next) {
   CompanyInfoModel.find({
        "isactive": true,
        "isdeleted": false
      }, function(err, companyinfos) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", companyinfos,req.headers.responsetype));
   });  
});


router.get('/:id',auth.authorize, function(req, res, next) {
   
   var _companyinfoid = req.params.id;
   CompanyInfoModel.findOne({
            "_id": _companyinfoid
      }, function(err, companyinfo) {
	
         if (err){
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else{
                  if (companyinfo == null) {
                     return res.send(messages.CustomExceptionHandler("authorization", 'companyinfo is not valid.',req.headers.responsetype));
                  }else{
                     return res.send(messages.CustomExceptionHandler("success", companyinfo,req.headers.responsetype));
                  }
	       
         }
      })
});


router.post('/',auth.authorize, function(req, res, next) {
      req.check('companyname', 'Company name should not be blank.').notEmpty();    
       req.check('userid', 'User should not be blank.').notEmpty();  
      var companyname = req.body.companyname;
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var title = req.body.companytitle;
      var email = req.body.email;
      var phone = req.body.phone;
      var streetaddress = req.body.streetaddress;
      var cityid = req.body.cityid;
      var stateid = req.body.stateid;
      var countryid = req.body.countryid;
      var zipcode = req.body.zipcode;
      var note = req.body.note;
      var companylogo = req.body.companylogo;
      var addedby = req.body.userid;
      var modifiedby = req.body.userid;
      var errors = req.validationErrors();
      if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
      }else{
            
            CompanyInfoModel.findOne({
                     "companyname":companyname,
                      "isactive": true,
                     "isdeleted": false
                  }, function (err, companyinfoExist) { 
                  if(err) 
                  {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
                  }
                  else if(companyinfoExist)
                  {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "companyinfo already exists",req.headers.responsetype));
                  }
                  else
                  {
                           var _companyinfo = new CompanyInfoModel({
                                 'companyname': companyname,
                                 'firstname' : firstname,
                                 'lastname' : lastname,
                                 'title': title,
                                 'phone' : phone,
                                 'email' : email,
                                 'streetaddress': streetaddress,
                                 'city' : cityid,
                                 'stateid' : stateid,
                                 'country' : countryid,
                                 'zipcode' : zipcode,
                                 'note' : note,
                                 'companylogo': companylogo,
                                 'addedby':addedby,
                                 'modifiedby':modifiedby
                           });
                           _companyinfo.save(function(error) {        
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
   req.check('companyinfoid', 'Company ID should not be blank.').notEmpty();   
  req.check('companyname', 'Company name should not be blank.').notEmpty();   
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean(); 
   var _companyinfoid = req.body.companyinfoid;  
      var companyname = req.body.companyname;
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var title = req.body.companytitle;
      var email = req.body.email;
      var phone = req.body.phone;
      var streetaddress = req.body.streetaddress;
      var cityid = req.body.cityid;
      var stateid = req.body.stateid;
      var countryid = req.body.countryid;
      var zipcode = req.body.zipcode;
      var note = req.body.note;
      var companylogo = req.body.companylogo;
      var isdeleted = req.body.isdeleted; 
      var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
	
         return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
   }else{
	    
	    CompanyInfoModel.findOne({
                  "companyname":companyname,
                   "isactive": true,
                  "isdeleted": false,
                  '_id':{$ne:_companyinfoid}
	    }, function (err, companyinfoExist){
                     if (err) 
                     {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
                     }
                     else if(companyinfoExist)
                     {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Duration already exist.",req.headers.responsetype));
                     }
                     else
                     {
			CompanyInfoModel.findOne({
			'_id':_companyinfoid
                                 }, function (error, findcompanyinfo) {
		    	    	    if (error) 
				    {
				       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
				    }
				    else if(findcompanyinfo)
				    {
					CompanyInfoModel.update({
						'_id': _companyinfoid
					},{
					    $set: {	
                   
                  'companyname': companyname,
                  'firstname' : firstname,
                  'lastname' : lastname,
                  'title': title,
                  'phone' : phone,
                  'email' : email,
                  'streetaddress': streetaddress,
                  'city' : cityid,
                  'stateid' : stateid,
                  'country' : countryid,
                  'zipcode' : zipcode,
                  'note' : note,
                  'companylogo': companylogo,
                  'isdeleted':isdeleted,
                  'isactive':isactive

						  
					    }
					},function(errupdate, companyinfoupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
					});
				    }
				    else
				    {
					return res.send(messages.CustomExceptionHandler("authorization", "companyinfo could not found!",req.headers.responsetype));
				    }
				});
		    }
	    });
    }
    
});

router.delete('/:companyinfoid',auth.authorize, function(req, res, next) {
    var _companyinfoid = req.params.companyinfoid;
    CompanyInfoModel.findOne({'_id':_companyinfoid},function(err, companyinfoExist){
	if (err) 
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
	else if(companyinfoExist)
	{
		CompanyInfoModel.update({
			    '_id': _companyinfoid
		},{
		    $set: {		
		      'isdeleted': true
		    }
		},function(errupdate, _companyinfoupdate) {
			if (errupdate)
			   return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			   return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		});
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "companyinfo could not found!",req.headers.responsetype));
	}
    });
});


module.exports = router;