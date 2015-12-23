var express = require('express');
var SubRegionsModel = require('../models/SubRegionsModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');


router.get('/', function (req, res, next) {
    SubRegionsModel.find({
        "isactive": true,
        "isdeleted": false
    }, function (err, regions) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", regions));
        }
    });
});


router.get('/:id', function (req, res, next) {
    var _regionid = req.params.id;
    SubRegionsModel.findOne({
        "_id": _regionid
    },function (err, region) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", region));
        }
    })
});


router.post('/', function (req, res, next) {
    req.check('subregionname', 'Region name should not be blank.').notEmpty();
    req.check('region', 'Region ID should not be blank.').notEmpty();
    req.check('userid', 'User should not be blank.').notEmpty();
    var name = req.body.subregionname;
    var region = req.body.region;
    var addedby = req.body.userid;
    var modifiedby = req.body.userid;
    var errors = req.validationErrors();
    if (errors) {
        return res.send(messages.CustomExceptionHandler("requiredparams", errors));

    } else {
        SubRegionsModel.findOne({
            "name": name,
            "isactive": true,
            "isdeleted": false
        }, function (err, regionExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message));
            }
            else if (regionExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "Region already exists"));
            }
            else {
                var _newregion = new SubRegionsModel({
                    'name': name,
                    'addedby': addedby,
                    'modifiedby': modifiedby
                });
                _newregion.save(function (error) {
                    if (error)
                        return res.send(messages.CustomExceptionHandler("systemerror", err.message));
                    else
                        return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted"));
                });
            }
        });
    }

});

router.put('/', function (req, res, next) {
    req.check('regionid', 'Region id should not be blank.').notEmpty();
    req.check('regionname', 'Region name should not be blank.').notEmpty();
    req.check('userid', 'User should not be blank.').notEmpty();
    req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
    req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
    var _regionid = req.body.regionid;
    var name = req.body.regionname;
    var modifiedby = req.body.userid;
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var isdeleted = req.body.isdeleted;
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {
        return res.send(messages.CustomExceptionHandler("requiredparams", errors));

    } else {
        RegionsModel.findOne({
            "name": name,
            "isactive": true,
            "isdeleted": false,
            '_id': { $ne: _regionid }
        }, function (err, regionExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message));
            }
            else if (regionExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "Region already exists"));
            }
            else {
                RegionsModel.findOne({
                    '_id': _regionid
                }, function (error, findregion) {
                    if (error) {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message));
                    }
                    else if (findregion) {
                        RegionsModel.update({
                            '_id': _regionid
                        }, {
                            $set: {
                                'name': name,                                
                                'modifiedby': modifiedby,
                                'modifieddate': modifieddate,
                                'isdeleted': isdeleted,
                                'isactive': isactive
                            }
                        }, function (errupdate, regionupdate) {
                            if (errupdate)
                                return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message));
                            else
                                return res.send(messages.CustomExceptionHandler("success", "Successfully updated."));
                        });
                    }
                    else {
                        return res.send(messages.CustomExceptionHandler("authorization", "Region could not found!"));
                    }
                });
            }
        });
    }


});

router.delete('/:regionid', function (req, res, next) {
    var _regionid = req.params.regionid;
    RegionsModel.findOne({ '_id': _regionid }, function (err, regionExist) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message));
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
                    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message));
                else
                    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted."));
            });
        }
        else {
            return res.send(messages.CustomExceptionHandler("authorization", "Region could not found!"));
        }
    });
});



module.exports = router;