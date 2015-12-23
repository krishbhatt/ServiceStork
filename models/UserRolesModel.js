var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var UserRolesSchema = Schema({
	/*_id:Schema.Types.ObjectId,*/
   	name: { type : String, required : true },
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:Schema.Types.ObjectId,
	addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	modifiedby:Schema.Types.ObjectId,
	modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')}
	
},{ versionKey: false });

module.exports = mongoose.model('userroles', UserRolesSchema);