var UsersModel = require('../models/UsersModel');
var moment = require('moment-timezone');
var messages = require('../messages.js');

exports.authorize = function(req, res, next) {
  if (req.headers.accesstoken) {
  	UsersModel.findOne({
		"access_token": req.headers.accesstoken,	
        "isactive": true,
        "isdeleted": false
    }).populate("userrole").exec(function(err, user) {
        if (err)
		{
			 res.send(401,messages.CustomExceptionHandler("unauthorised", "unauthorized"));
			
		}
        else
		{
			if(user)
			{
			var diff=	moment.utc(moment(user.expiration,"DD/MM/YYYY HH:mm:ss").diff(moment.utc().format('YYYY-MM-DD HH:mm:ss'))).format("HH:mm:ss");
			var duration = moment.duration(diff);

			var sec=Math.floor(duration.asSeconds());
			if(sec>0)
			 next();
			else
			
			 res.send(401,messages.CustomExceptionHandler("unauthorised", "accesstoken expired"));
			}
			 else
			 {
			 	res.send(401,messages.CustomExceptionHandler("unauthorised", "not a valid accesstoken"));
			 
			}
		}
    });
   
  } else {
  	res.send(401,messages.CustomExceptionHandler("unauthorised", "unauthorized"));
    
  }
}