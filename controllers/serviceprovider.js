var express = require('express');
var ServiceProvidersModel = require('../models/ServiceProvidersModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var auth = require('../config/auth');
var expressValidator = require('express-validator');


router.post('/', function (req, res, next) {

    req.check('name', 'name should not be blank.').notEmpty();
    req.check('email', 'email is required.').isEmail();


    var userid = req.body.loggedinuserid;
    var name = req.body.name;
    var ssnumber = req.body.ssnumber;
    var image = req.body.image;
    var phone1 = req.body.phone1;
    var phone2 = req.body.phone2;
    var email = req.body.email;
    var streetaddress = req.body.streetaddress;
    var city = req.body.city;
    var country = req.body.country;
    var region=req.body.region;
    var subregion=req.body.subregion;
    var zip = req.body.zip;
    var hiredate = req.body.hiredate;
    var hireby = req.body.hireby;
    var dateofbirth = req.body.dateofbirth;
    var insuranceprovider = req.body.insuranceprovider;
    var renewaldate = req.body.renewaldate;
    var notes = req.body.notes;
    var situationperformed = req.body.situationperformed;
    var specificmodalities = req.body.specificmodalities;
    var maxassignmentdistanceinmile = req.body.maxAssignmentdistanceinmile;
    var willingforminnumberofassignment = req.body.willingforminnumberofassignment;
    var minnumberofassignment = req.body.minnumberofassignment;
	var supplies=req.body.supplies;
	var assignmenttypes=req.body.assignmenttypes;
	var services=req.body.services;
	var servedregions=req.body.servedregions;
    var licences=req.body.licences;
    var serviceprovideravailibility=req.body.serviceprovideravailibility;
    var addedby = req.body.userid;
    var modifiedby = req.body.userid;
    var errors = req.validationErrors();
    if (errors) {
        return res.send(messages.CustomExceptionHandler("requiredparams", errors));
    }
    else {
        ServiceProvidersModel.findOne({
            "email": email,
            "isactive": true,
            "isdeleted": false
        }, function (err, serviceproviderExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
            }
            else if (serviceproviderExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "service provider already exists",req.headers.responsetype));
            }
            else {
                var _newserviceprovider = new ServiceProvidersModel({
                    'userid': userid,
                    'name': name,
                    'ssnumber': ssnumber,
                    'image': image,
                    'phone1': phone1,
                    'phone2': phone2,
                    'email': email,
                    'streetaddress': streetaddress,
					'city':city,
					'country':country,
					'region':region,
					'subregion':subregion,
                    'zip': zip,
                    'hiredate': hiredate,
                    'hireby': hireby,
                    'dateofbirth': dateofbirth,
                    'insuranceprovider': insuranceprovider,
                    'renewaldate': renewaldate,
                    'notes': notes,
                    'situationperformed': situationperformed,
                    'specificmodalities': specificmodalities,
                    'maxAssignmentdistanceinmile': maxassignmentdistanceinmile,
                    'willingforminnumberofassignment': willingforminnumberofassignment,
                    'minnumberofassignment': minnumberofassignment,
                    'services': services,
                    'supplies': supplies,
                    'assignmenttypes': assignmenttypes,
                    'servedregions': servedregions,
					'licences':licences,
					'serviceprovideravailibility':serviceprovideravailibility,
                    'addedby': addedby,
                    'modifiedby': modifiedby
                });
                _newserviceprovider.save(function (error) {
                    console.log(error);
                    if (error)
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
                    else
                        return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
                });
            }
        });
    }
});


router.get('/', function (req, res, next) {
    ServiceProvidersModel.find(
		{ "isactive": true, "isdeleted": false }
	    ).populate(["country","city","region","subregion","supplies","assignmenttypes","services","servedregions","licences","serviceprovideravailibility"]).exec(function (err, serviceproviders) {
	        if (err)return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", serviceproviders,req.headers.responsetype));
	    });
});


router.get('/:id', function (req, res, next) {
    var _serviceproviderid = req.params.id;
    ServiceProvidersModel.findOne(
		{ "_id": _serviceproviderid ,"isactive": true, "isdeleted": false }
	    ).populate(["country","city","region","subregion","supplies","assignmenttypes","services","servedregions","licences","serviceprovideravailibility"]).exec(function (err, serviceprovider) {
	        if (err) return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", serviceprovider,req.headers.responsetype));
	    });
});

//router.post('/',upload.single('profileimage'),function(req, res, next) {	

router.put('/', function (req, res, next) {
	req.check('name', 'name should not be blank.').notEmpty();
    req.check('email', 'email is required.').isEmail();
	
    var _serviceproviderid = req.body.serviceproviderid;
    var userid = req.body.loggedinuserid;
    var name = req.body.name;
    var ssnumber = req.body.ssnumber;
    var image = req.body.image;
    var phone1 = req.body.phone1;
    var phone2 = req.body.phone2;
    var email = req.body.email;
    var streetaddress = req.body.streetaddress;
    var city = req.body.city;
    var country = req.body.country;
    var region=req.body.region;
    var subregion=req.body.subregion;
    var zip = req.body.zip;
    var hiredate = req.body.hiredate;
    var hireby = req.body.hireby;
    var dateofbirth = req.body.dateofbirth;
    var insuranceprovider = req.body.insuranceprovider;
    var renewaldate = req.body.renewaldate;
    var notes = req.body.notes;
    var situationperformed = req.body.situationperformed;
    var specificmodalities = req.body.specificmodalities;
    var maxassignmentdistanceinmile = req.body.maxAssignmentdistanceinmile;
    var willingforminnumberofassignment = req.body.willingforminnumberofassignment;
    var minnumberofassignment = req.body.minnumberofassignment;
	var supplies=req.body.supplies;
	var assignmenttypes=req.body.assignmenttypes;
	var services=req.body.services;
	var servedregions=req.body.servedregions;
    var licences=req.body.licences;
	 var serviceprovideravailibility=req.body.serviceprovideravailibility;
    var addedby = req.body.userid;
    var modifiedby = req.body.userid;
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var isdeleted = req.body.isdeleted;
    var isactive = req.body.isactive;
    var isvisible = req.body.isvisible;

    ServiceProvidersModel.findOne({
        "email": email,
        "isactive": true,
        "isdeleted": false,
        "_id": { $ne: _serviceproviderid }
    }, function (err, serviceproviderExist) {
        if (err) {
              return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
		    }
		    else if(serviceproviderExist)
		    {
			    return res.send(messages.CustomExceptionHandler("duplicatecheck", "Service provider already exists",req.headers.responsetype));
	
        }
        else {
            ServiceProvidersModel.findOne({
                '_id': _serviceproviderid
            }, function (error, findserviceprovider) {
                if (error) {
                   return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
                }
                else if (findserviceprovider) {
                    ServiceProvidersModel.update({
                        '_id': _serviceproviderid
                    }, {
                        $set: {
							        'userid': userid,
									'name': name,
									'ssnumber': ssnumber,
									'image': image,
									'phone1': phone1,
									'phone2': phone2,
									'email': email,
									'streetaddress': streetaddress,
									'city':city,
									'country':country,
									'region':region,
									'subregion':subregion,
									'zip': zip,
									'hiredate': hiredate,
									'hireby': hireby,
									'dateofbirth': dateofbirth,
									'insuranceprovider': insuranceprovider,
									'renewaldate': renewaldate,
									'notes': notes,
									'situationperformed': situationperformed,
									'specificmodalities': specificmodalities,
									'maxAssignmentdistanceinmile': maxassignmentdistanceinmile,
									'willingforminnumberofassignment': willingforminnumberofassignment,
									'minnumberofassignment': minnumberofassignment,
									'services': services,
									'supplies': supplies,
									'assignmenttypes': assignmenttypes,
									'servedregions': servedregions,
									'licences':licences,
									'serviceprovideravailibility':serviceprovideravailibility,
									'addedby': addedby,
									 'modifiedby': modifiedby,
									'modifieddate': modifieddate,
									'isdeleted': isdeleted,
									'isactive': isactive,
									'isvisible': isvisible
                        }
                    }, function (errupdate, serviceproviderupdate) {
                        if (errupdate)
                           return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
						else
						   return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
                    });
                }
                else {
				return res.send(messages.CustomExceptionHandler("authorization", "Service provider could not found",req.headers.responsetype));
                }
            });
        }
    });
});

router.delete('/:serviceproviderid', function (req, res, next) {
    var _serviceproviderid = req.params.serviceproviderid;
    ServiceProvidersModel.findOne({ '_id': _serviceproviderid }, function (err, serviceproviderExist) {
        if (err) {
            return res.send(400, { "ResponseDetails": { "ResponseCode": "Bad Request", "ResponseStatus": 400 }, "ResponseMessage": err.message });
        }
        else if (serviceproviderExist) {
            ServiceProvidersModel.update({
                '_id': _serviceproviderid
            }, {
                $set: {
                    'isdeleted': true
                }
            }, function (errupdate, serviceproviderupdate) {
                if (errupdate)
                   return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
				return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		        });
        }
        else {
			return res.send(messages.CustomExceptionHandler("authorization", "Service provider could not found",req.headers.responsetype));
        }
    });
});


module.exports = router;