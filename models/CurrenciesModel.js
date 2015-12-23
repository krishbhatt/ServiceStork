var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var CurrenciesSchema = Schema({
	/*_id:Schema.Types.ObjectId,*/
   	name: { type : String, required : true },
	code: { type : String, required : true },
	symbol: { type : String, required : true },
	isbasecurrency:{ type: Boolean, required: true },
   	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{type:Schema.Types.ObjectId, required:true},
	addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	modifiedby:Schema.Types.ObjectId,
	modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')}
	
},{ versionKey: false });

module.exports = mongoose.model('currencies', CurrenciesSchema);