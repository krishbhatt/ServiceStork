var express = require('express');
var TherapistsModel = require('../models/TherapistsModel');
var router = express.Router();
var moment = require('moment-timezone');

router.get('/', function(req, res, next) {
    TherapistsModel.find({
        "isactive": true,
        "isdeleted": false
    }, function(err, therapists) {
        if (err)
		{
			return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":err.message});
		}
        else
		{
			return res.send(200,{"ResponseDetails":{"ResponseCode":"OK","ResponseStatus":200},"Result":therapists});
		}
    });
});

router.get('/:id', function(req, res, next) {
    var _therapistid = req.params.id;
    TherapistsModel.findOne({
        "_id": _therapistid
    }, function(err, therapist) {
        if (err)
		{
			return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":err.message});
		}
        else
		{
			return res.send(200,{"ResponseDetails":{"ResponseCode":"OK","ResponseStatus":200},"Result":therapist});
		}
    })
});

router.post('/', function(req, res, next) {	
	var name = req.body.name;
	var imagename = req.body.imagename;
	var phone1 = req.body.phone1;
	var phone2 = req.body.phone2;
	var email = req.body.email;
	var StreetAddress = req.body.StreetAddress;
	var region = req.body.region;
	var zip = req.body.zip;
	var notes = req.body.notes;
	var situationperformed = req.body.situationperformed;
	var specificmodalities = req.body.specificmodalities;
	var maxAssignmentdistanceinmile = req.body.maxAssignmentdistanceinmile;
	var minnumberofassignment = req.body.minnumberofassignment;
	var profilerating = req.body.profilerating;
	var ratingindeeptissueskill = req.body.ratingindeeptissueskill;
	var services = req.body.services;
	var supplies = req.body.supplies;
	var assignmenttypes = req.body.assignmenttypes;
	var servedregions = req.body.servedregions;
	var addedby = req.body.userid;
	var modifiedby = req.body.userid;
	TherapistsModel.findOne({
	    "name":name
    }, function (err, therapistExist) { 
       if(err) 
       {
	console.log("error");
         return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":err.message});
       }
       else if(therapistExist)
       {
         return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":"Therapist already exists"});
	   }
	   else
	   {
         var _newtherapist = new TherapistsModel({
	    'name': name,
	    'imagename': imagename,
	    'phone1' : phone1,
	    'phone2' : phone2,
	    'email' : email,
	    'StreetAddress' : StreetAddress,
	    'region' :region,
	    'zip' :zip,
	    'notes' : notes,
	    'situationperformed' : situationperformed,
	    'specificmodalities' : specificmodalities,
	    'maxAssignmentdistanceinmile' : maxAssignmentdistanceinmile,
	    'minnumberofassignment' : minnumberofassignment,
	    'profilerating' : profilerating,
	    'ratingindeeptissueskill' : ratingindeeptissueskill,
	    'services' : services,
	    'supplies' : supplies,
	    'assignmenttypes' : assignmenttypes,
	    'servedregions': servedregions,
	    'addedby': addedby,
	    'modifiedby': modifiedby
         });
         _newtherapist.save(function(error){        
           if (error)        
            return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":error.message});
           else
            return res.send(200,{"ResponseDetails":{"ResponseCode":"OK","ResponseStatus":200},"Result":"Successfully Inserted"});
         });
	   }
	});
});

router.put('/', function(req, res, next) {									
    var _therapistid = req.body.therapistid;
    var name = req.body.cityname;
    var imagename = req.body.imagename;
    var phone1 = req.body.phone1;
    var phone2 = req.body.phone2;
    var email = req.body.email;
    var StreetAddress = req.body.StreetAddress;
    var region = req.body.region;
    var zip = req.body.zip;
    var notes = req.body.notes;
    var situationperformed = req.body.situationperformed;
    var specificmodalities = req.body.specificmodalities;
    var maxAssignmentdistanceinmile = req.body.maxAssignmentdistanceinmile;
    var minnumberofassignment = req.body.minnumberofassignment;
    var profilerating = req.body.profilerating;
    var ratingindeeptissueskill = req.body.ratingindeeptissueskill;
    var services = req.body.services;
    var supplies = req.body.supplies;
    var assignmenttypes = req.body.assignmenttypes;
    var servedregions = req.body.servedregions;
    var modifiedby = req.body.userid; 
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
    var isdeleted = req.body.isdeleted; 
    var isactive = req.body.isactive; 
    TherapistsModel.findOne({
        "name":name,
        '_id':{$ne:_therapistid}
    }, function (err, therapistExist){
        if (err) 
        {
		   return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":err.message});  
        }
        else if(therapistExist)
        {
		   return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":"Therapist already exists"});
        }
        else
        {
           TherapistsModel.findOne({
            '_id':_therapistid
           }, function (error, findtherapist) {
			  if (error) 
			  {
				return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":error.message});  
			  }
			  else if(findtherapist)
			  {
				TherapistsModel.update({
				'_id': _therapistid
			    },{
				 $set: {		
				    'name': name,
				    'imagename': imagename,
				    'phone1' : phone1,
				    'phone2' : phone2,
				    'email' : email,
				    'StreetAddress' : StreetAddress,
				    'region' :region,
				    'zip' :zip,
				    'notes' : notes,
				    'situationperformed' : situationperformed,
				    'specificmodalities' : specificmodalities,
				    'maxAssignmentdistanceinmile' : maxAssignmentdistanceinmile,
				    'minnumberofassignment' : minnumberofassignment,
				    'profilerating' : profilerating,
				    'ratingindeeptissueskill' : ratingindeeptissueskill,
				    'services' : services,
				    'supplies' : supplies,
				    'assignmenttypes' : assignmenttypes,
				    'servedregions': servedregions,
				    'modifiedby':modifiedby,
				    'modifieddate':modifieddate,
				    'isdeleted':isdeleted,
				    'isactive':isactive
				 }
			    },function(errupdate, therapistpdate) {
				  if (errupdate)       
				    return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":errupdate.message});
				  else
					return res.send(200,{"ResponseDetails":{"ResponseCode":"OK","ResponseStatus":200},"Result":"Successfully Updated"});
			    });
			  }
			  else
			  {
				 return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":"Therapist could not found"});
			  }
		   });
		}
	});
});

router.delete('/:therapistid', function(req, res, next) {
    var _therapistid = req.params.therapistid;
	TherapistsModel.findOne({'_id':_therapistid},function(err,therapistExist){
       if (err) 
       {
		   return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":err.message});  
       }
       else if(therapistExist)
       {
		   TherapistsModel.update({
				'_id': _therapistid
		   },{
			 $set: {		
			  'isdeleted': true
			 }
		   },function(errupdate, _therapistupdate) {
			  if (errupdate)       
				return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":errupdate.message});
			  else
				return res.send(200,{"ResponseDetails":{"ResponseCode":"OK","ResponseStatus":200},"Result":"Successfully Deleted"});
		   });
       }
	   else
	   {
		 return res.send(400,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":400},"ResponseMessage":"Therapist could not found"});
	   }
	});
});



module.exports = router;