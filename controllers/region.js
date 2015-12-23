var express = require('express');
var RegionsModel = require('../models/RegionsModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var async = require('async');
var expressValidator = require('express-validator');
var SubRegionsModel = require('../models/SubRegionsModel');
var auth = require('../config/auth');

router.get('/',auth.authorize, function(req, res, next) {
   RegionsModel.find({	    
        "isactive": true,
        "isdeleted": false
    }).populate(["parentid"]).exec(function(err, regions) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
            return res.send(messages.CustomExceptionHandler("success", regions,req.headers.responsetype));
   });  
});


router.get('/:id',auth.authorize, function (req, res, next) {
    var _regionid = req.params.id;
   RegionsModel.findOne({	
       "_id": _regionid ,   
        "isactive": true,
        "isdeleted": false
    }).populate(["parentid"]).exec(function (err, region) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", region,req.headers.responsetype));
        }
    })
});


router.post('/',auth.authorize, function (req, res, next) {
    req.check('regionname', 'Region name should not be blank.').notEmpty();
    req.check('userid', 'User should not be blank.').notEmpty();
    var name = req.body.regionname; 
	var parentid=req.body.parentid; 
    var addedby = req.body.userid;
    var modifiedby = req.body.userid;
    var errors = req.validationErrors();
    if (errors) {
        return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));

    } else {
        RegionsModel.findOne({
            "name": name,
			"parentid": parentid,
            "isactive": true,
            "isdeleted": false
        }, function (err, regionExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
            }
            else if (regionExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "Region already exists",req.headers.responsetype));
            }
            else {
                var _newregion = new RegionsModel({
                    'name': name,
					"parentid": parentid,
                    'addedby': addedby,
                    'modifiedby': modifiedby
                });
                _newregion.save(function (error) {
                    if (error)
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
                    else
                        return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
                });
            }
        });
    }

});

router.put('/',auth.authorize, function (req, res, next) {
    req.check('regionid', 'Region id should not be blank.').notEmpty();
    req.check('regionname', 'Region name should not be blank.').notEmpty();
    req.check('userid', 'User should not be blank.').notEmpty();
    req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
    req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
    var _regionid = req.body.regionid;
    var name = req.body.regionname;
	var parentid=req.body.parentid;
    var modifiedby = req.body.userid;
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var isdeleted = req.body.isdeleted;
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {
        return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));

    } else {
        RegionsModel.findOne({
            "name": name,
			"parentid": parentid,
            "isactive": true,
            "isdeleted": false,
            '_id': { $ne: _regionid }
        }, function (err, regionExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
            }
            else if (regionExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "Region already exists",req.headers.responsetype));
            }
            else {
                RegionsModel.findOne({
                    '_id': _regionid
                }, function (error, findregion) {
                    if (error) {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
                    }
                    else if (findregion) {
                        RegionsModel.update({
                            '_id': _regionid
                        }, {
                            $set: {
                                'name': name,
								"parentid": parentid,                                
                                'modifiedby': modifiedby,
                                'modifieddate': modifieddate,
                                'isdeleted': isdeleted,
                                'isactive': isactive
                            }
                        }, function (errupdate, regionupdate) {
                            if (errupdate)
                                return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
                            else
                                return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
                        });
                    }
                    else {
                        return res.send(messages.CustomExceptionHandler("authorization", "Region could not found!",req.headers.responsetype));
                    }
                });
            }
        });
    }


});

router.delete('/:regionid',auth.authorize, function (req, res, next) {
    var _regionid = req.params.regionid;
    RegionsModel.findOne({ '_id': _regionid }, function (err, regionExist) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
        }
        else if (regionExist) {
            RegionsModel.update({
                '_id': _regionid
            }, {
                $set: {
                    'isdeleted': true
                }
            }, function (errupdate, regionupdate) {
                if (errupdate)
                    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
                else
                    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
            });
        }
        else {
            return res.send(messages.CustomExceptionHandler("authorization", "Region could not found!",req.headers.responsetype));
        }
    });
});



module.exports = router;