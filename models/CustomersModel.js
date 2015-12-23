var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var CustomersAddressSchema= Schema({
	name: { type : String, required : true },
	addresstype:{type:Schema.Types.ObjectId, ref:"servicelocationtypes"},
	street:String,
	city:{ type:Schema.Types.ObjectId, ref:'cities' },
    country:{ type:Schema.Types.ObjectId, ref:'countries'},
	zipcode:String,
   	phone1:String,
	phone2:String,
	isprimaryaddress:{ type: Boolean, default: true }
});	


var CustomersSchema = Schema({
   	userid: { type : String, required : true },
	customertype:{type:Schema.Types.ObjectId, ref:"customertype"},
	customersubtype:{type:Schema.Types.ObjectId, ref:"customertype"},
	firstname:{ type : String, required : true },
	lastname:String,
   	imagename:String,
	gender:String,
   	email:{ type : String, required : true },
	emailpreferenceforcommunication:{ type: Boolean, default: false },
	phonepreferenceforcommunication:{ type: Boolean, default: false },
	messagepreferenceforcommunication:{ type: Boolean, default: false },
	region:{type:Schema.Types.ObjectId, ref:"regions"},
	subregion:{ type:Schema.Types.ObjectId, ref:'regions' },
	rating:Number,
   	longitude:String,
	latitude:String,
	note:String,
	details:String,
	customeraddress:[CustomersAddressSchema],
	isauthorised:{ type: Boolean, default: true },
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{type:Schema.Types.ObjectId, required:true},
	addeddate:{type: Date, default: Date.now},
	modifiedby:Schema.Types.ObjectId,
	modifieddate:{type: Date, default: Date.now}
},{ versionKey: false });
module.exports = mongoose.model('customers', CustomersSchema);




