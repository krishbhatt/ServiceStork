var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var ServicePackageAddonsSchema = Schema({
	name : {type :String, required : true},
   	servicepackage : { type : Schema.Types.ObjectId, ref : 'servicepackages' },
	service : { type : Schema.Types.ObjectId, ref : 'services' },
	duration : { type : Schema.Types.ObjectId, ref : 'durations' },
	currency : { type : Schema.Types.ObjectId, ref : 'currencies' },
	cost : {type : String, required : true},
	note : { type : String },
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{type:Schema.Types.ObjectId, required:true},
	addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	modifiedby:{type:Schema.Types.ObjectId},
	modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	serviceproviders : { type: Schema.Types.ObjectId, ref: 'serviceproviders' }
},{ versionKey: false });

module.exports = mongoose.model('servicepackageaddons', ServicePackageAddonsSchema);