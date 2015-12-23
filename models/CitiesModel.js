var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;

var CitiesSchema = Schema({
	/*_id:Schema.Types.ObjectId,*/
   	name: { type : String, required : true },  
   	country: {type: Schema.Types.ObjectId, ref: 'countries'},  
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:Schema.Types.ObjectId,
	addeddate:{type: Date, default: Date.now},
	modifiedby:Schema.Types.ObjectId,
	modifieddate:{type: Date, default: Date.now}
	
},{ versionKey: false });

module.exports = mongoose.model('cities', CitiesSchema);