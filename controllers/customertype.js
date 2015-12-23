var express = require('express');
var CustomersTypesModel = require('../models/CustomersTypesModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');

router.get('/', auth.authorize,function(req, res, next) {
   CustomersTypesModel.find({	    
        "isactive": true,
        "isdeleted": false
    }).populate(["parentid"]).exec(function(err, customertypes) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", customertypes,req.headers.responsetype));
   });  
});


router.get('/:id',auth.authorize, function(req, res, next) {
   
   var _customertypeid = req.params.id;
    CustomersTypesModel.findOne({	 
	 "_id": _customertypeid,   
        "isactive": true,
        "isdeleted": false
    }).populate(["parentid"]).exec(function(err, customertype){
	
         if (err){
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         }
         else{
                  if (customertype == null) {
                      return res.send(messages.CustomExceptionHandler("authorization", 'Customer type id is not valid.',req.headers.responsetype));
                  }else{
                      return res.send(messages.CustomExceptionHandler("success", customertype,req.headers.responsetype));
                  }
	       
         }
      })
});
 

router.post('/',auth.authorize, function(req, res, next) {
      req.check('customertypename', 'Name should not be blank.').notEmpty();
      var name = req.body.customertypename;
	  var parentid=req.body.parentid;
      var addedby = req.body.userid;
      var modifiedby = req.body.userid;
      var errors = req.validationErrors();
      if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
      }else{
            
            CustomersTypesModel.findOne({
                     "name":name,
					 "parentid": parentid,
                      "isactive": true,
                     "isdeleted": false
                  }, function (err, customertypenameExist) { 
                  if(err) 
                  {
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
                  }
                  else if(customertypenameExist)
                  {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Customer type name already exists",req.headers.responsetype));
                  }
                  else
                  {
                           var _customertype = new CustomersTypesModel({
                                 'name': name,
								 "parentid": parentid,
                                 'addedby':addedby,
                                 'modifiedby':modifiedby
                           });
                           _customertype.save(function(error) {        
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
   req.check('customertypeid', 'Customer Type Id should not be blank.').notEmpty();
   req.check('customertypename', 'Name should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _customertypeid = req.body.customertypeid;
   var name = req.body.customertypename; 
   var parentid=req.body.parentid;
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
	
         return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
   }else{
	    
	    CustomersTypesModel.findOne({
                  "name":name,
				  "parentid": parentid,
                   "isactive": true,
                  "isdeleted": false,
                  '_id':{$ne:_customertypeid}
	    }, function (err, customerTypeExist){
                     if (err) 
                     {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
                     }
                     else if(customerTypeExist)
                     {
                        return res.send(messages.CustomExceptionHandler("duplicatecheck", "Customer type name  already exist.",req.headers.responsetype));
                     }
                     else
                     {
			CustomersTypesModel.findOne({
			'_id':_customertypeid
                                 }, function (error, findcustomertype) {
		    	    	    if (error) 
				    {
				       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
				    }
				    else if(findcustomertype)
				    {
					CustomersTypesModel.update({
						'_id': _customertypeid
					},{
					    $set: {		
						    'name': name,
							"parentid": parentid,
						    'modifieddate':modifieddate,
						    'isdeleted':isdeleted,
						    'isactive':isactive
					    }
					},function(errupdate, customertypeupdate) {
					    if (errupdate)
						return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
					});
				    }
				    else
				    {
				       return res.send(messages.CustomExceptionHandler("authorization", "Customer type could not found!",req.headers.responsetype));
				    }
				});
		    }
	    });
    }
    
});

router.delete('/:customertypeid',auth.authorize, function(req, res, next) {
    var _customertypeid = req.params.customertypeid;
    CustomersTypesModel.findOne({'_id':_customertypeid},function(err, customerTypeExist){
	if (err) 
	{
		return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
	else if(customerTypeExist)
	{
		CustomersTypesModel.update({
			    '_id': _customertypeid
		},{
		    $set: {		
		      'isdeleted': true
		    }
		},function(errupdate, _customertypeupdate) {
			if (errupdate)
			    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		});
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Customer type could not found!",req.headers.responsetype));
	}
    });
});


module.exports = router;