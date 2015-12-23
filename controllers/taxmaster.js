var express = require('express');
var TaxMasterModel = require('../models/TaxMasterModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');


router.post('/',auth.authorize,function(req, res, next) {
   req.check('taxname', 'tax name should not be blank.').notEmpty();
   var taxname = req.body.taxname;
   var taxpercentage=req.body.taxpercentage;
   var addedby = req.body.userid;
   var modifiedby = req.body.userid;
   var errors = req.validationErrors();
   if (errors) {
      return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
   
   }else{
         
      TaxMasterModel.findOne({
            "taxname":taxname,
             "isactive": true,
            "isdeleted": false
         }, function (err, taxExist) { 
            if(err) 
            {
               return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
            }
            else if(taxExist)
            {
               return res.send(messages.CustomExceptionHandler("duplicatecheck", "Tax Master already exists",req.headers.responsetype));
            }
            else
            {
             var _TaxMasterModel = new TaxMasterModel({
			 "taxname":taxname,
			 "taxpercentage":taxpercentage,
			'addedby':addedby,
			'modifiedby':modifiedby
                  });
                  _TaxMasterModel.save(function(error) {        
                     if (error)        
			return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
		     else
                        return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
                  });
            }
         });
   }
    
});


router.get('/',auth.authorize,  function(req, res, next) {
   TaxMasterModel.find({
        "isactive": true,
        "isdeleted": false
      }, function(err, TaxMasters) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", TaxMasters,req.headers.responsetype));
   });  
});


router.get('/:id',auth.authorize, function(req, res, next) {
   
   var _TaxMasterid= req.params.id;
   TaxMasterModel.findOne({
            "_id": _TaxMasterid
      }, function(err, TaxMaster) {
	
          if (err)
      {
              return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
      }
      else
      {
              return res.send(messages.CustomExceptionHandler("success", TaxMaster,req.headers.responsetype));
      }
      })
});


router.put('/',auth.authorize, function(req, res, next) {
   
   req.check('taxmasterid', 'Taxmaster id should not be blank.').notEmpty();
   req.check('taxname', 'Taxmaster name should not be blank.').notEmpty();
   req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
   var _taxmasterid= req.body.taxmasterid;
   var taxname = req.body.taxname;
   var taxpercentage=req.body.taxpercentage;
   var modifiedby = req.body.userid;
   var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
   var isdeleted = req.body.isdeleted; 
   var isactive = req.body.isactive;
   var errors = req.validationErrors();
   if (errors) {
      return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
   
   }else{
	    TaxMasterModel.findOne({
		    "taxname":taxname,
        "isactive": true,
        "isdeleted": false,
		    '_id':{$ne:_taxmasterid}
		}, function (err, TaxExist){
		    if (err) 
		    {
			    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
		    }
		    else if(TaxExist)
		    {
			    return res.send(messages.CustomExceptionHandler("duplicatecheck", "Tax master name already exists",req.headers.responsetype));
		    }
		    else
		    {
			    TaxMasterModel.findOne({
				    '_id':_taxmasterid
				}, function (error, findpayment) {
					if (error) 
					{
						return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
					}
					else if(findpayment)
					{
					    TaxMasterModel.update({
						'_id': _taxmasterid
					    },{
						$set: {		
							'taxname': taxname,
							'taxpercentage': taxpercentage,
							'modifiedby':modifiedby,
							'modifieddate':modifieddate,
							'isdeleted':isdeleted,
							'isactive':isactive
						    }
					    },function(errupdate, taxmaster) {
						if (errupdate)
						   return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
						else
						   return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
						});
					}
					else
					{
						return res.send(messages.CustomExceptionHandler("authorization", "Tax master  could not found!",req.headers.responsetype));
					}
			    });
		}
	});
    }
});


router.delete('/:taxmasterid',auth.authorize, function(req, res, next) {
    var _taxmasterid = req.params.taxmasterid;
    TaxMasterModel.findOne({'_id':_taxmasterid},function(err,taxmasterExist){
	if (err) 
	{
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
	}
	else if(taxmasterExist)
	{
		TaxMasterModel.update({
				'_id': _taxmasterid
			},{
			$set: {		
			    'isdeleted': true
			}
		    },function(errupdate, taxmasterupdate) {
			if (errupdate)       
				return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
				return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		    });
	}
	else
	{
		return res.send(messages.CustomExceptionHandler("authorization", "Payment Mode could not found!",req.headers.responsetype));
	}
    });
});

module.exports = router;