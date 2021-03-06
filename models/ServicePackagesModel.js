var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var ServicePackagesSchema = Schema({
	name : {type :String, required : true},
   	service: { type : Schema.Types.ObjectId, ref: 'services' },
	region: { type : Schema.Types.ObjectId, ref: 'regions' },
	locationtype: { type : Schema.Types.ObjectId, ref: 'servicelocationtypes' },
	duration : { type : Schema.Types.ObjectId, ref: 'durations' },
	currency : { type : Schema.Types.ObjectId, ref: 'currencies' },
	cost : {type : String, required : true},
	note : { type : String },
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{type:Schema.Types.ObjectId, required:true},
	addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	modifiedby:{type:Schema.Types.ObjectId},
	modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')}
},{ versionKey: false });

module.exports = mongoose.model('servicepackages', ServicePackagesSchema);