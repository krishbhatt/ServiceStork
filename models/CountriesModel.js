var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var ContriesSchema = Schema({
	/*_id:Schema.Types.ObjectId,*/
   	name: { type : String, required : true },
	cities : [{type : Schema.Types.ObjectId, ref: 'cities'}],
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{type:Schema.Types.ObjectId, required:true},
	addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	modifiedby:{type:Schema.Types.ObjectId, required:true},
	modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	
});

module.exports = mongoose.model('countries', ContriesSchema);