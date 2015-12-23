var express = require('express');
var AssignmentTypesModel = require('../models/AssignmentTypesModel');
var router = express.Router();
var moment = require('moment-timezone');

router.get('/', function(req, res, next) {
    AssignmentTypesModel.find({
        "isactive": true,
        "isdeleted": false
    }, function(err, assignmenttypes) {
       if (err)        
            return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":err.message});
        else
            return res.send(200,{"ResponseDetails":{"ResponseCode":"OK","ResponseStatus":200},"Result":assignmenttypes});
    });
});

router.post('/', function(req, res, next) {	
    var name = req.body.assignmenttypename;
    var addedby = req.body.userid;
    var modifiedby = req.body.userid;
    AssignmentTypesModel.findOne({
       "name":name,
        "isactive": true,
        "isdeleted": false
    }, function (err, assignmenttypenameExist) { 
       if(err) 
       {
         return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":err.message});
       }
       else if(assignmenttypenameExist)
       {
         return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":"Assignment type already exists"});
	   }
	   else
	   {
		 var _assignmenttype = new AssignmentTypesModel({
			'name': name,
			'addedby':addedby,
			'modifiedby':modifiedby
		 });
		 _assignmenttype.save(function(error) {        
		   if (error)        
				return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":error.message});
			else
				return res.send(200,{"ResponseDetails":{"ResponseCode":"OK","ResponseStatus":200},"Result":"Successfully Inserted"});
		 });
       }
	});
});
																
module.exports = router;