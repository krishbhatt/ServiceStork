var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var appointmentTypesSchema = Schema({	
    appointmentypename: { type : String, required : true },
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{type:Schema.Types.ObjectId, required:true},
	addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	modifiedby:{type:Schema.Types.ObjectId, required:true},
	modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')}
},{ versionKey: false });

module.exports = mongoose.model('appointmenttypes', appointmentTypesSchema);