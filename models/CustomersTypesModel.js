var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var CustomerTypeSchema = Schema({
   	name: { type : String, required : true },
	parentid:{ type:Schema.Types.ObjectId, ref:'customertypes' },
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{ type:Schema.Types.ObjectId },
	addeddate:{ type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss') },
	modifiedby:{ type:Schema.Types.ObjectId },
	modifieddate:{ type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss') },
},{ versionKey: false });

module.exports = mongoose.model('customertypes', CustomerTypeSchema);

/*var CustomersSchema = Schema({
   	name: { type : String, required : true },
	customertypeid:{type:Schema.Types.ObjectId, ref:"customertype"},
	customersubtypeid:{type:Schema.Types.ObjectId, ref:"customersubtype"},
	firstname:String,
	lastname:String,
   	imagename:String,
	gender:String,
   	email:String,
	emailpreferenceforcommunication:{ type: Boolean, default: false },
	phonepreferenceforcommunication:{ type: Boolean, default: false },
	messagepreferenceforcommunication:{ type: Boolean, default: false },
	region:{type:Schema.Types.ObjectId, ref:"regions"},
	subregion:{ type:Schema.Types.ObjectId, ref:'subregions' },
	rating:Number,
   	longitude:String,
	latitude:String,
	note:String,
	details:String,
	isauthorised:{ type: Boolean, default: true },
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{type:Schema.Types.ObjectId, required:true},
	addeddate:{type: Date, default: Date.now},
	modifiedby:Schema.Types.ObjectId,
	modifieddate:{type: Date, default: Date.now}
});

var CustomersAddress = Schema({
	name: { type : String, required : true },
	customerid:{type:Schema.Types.ObjectId, ref:"customers"},
	addresstypeid:{type:Schema.Types.ObjectId, ref:"servicelocationtypes"},
	street:String,
	city:{ type:Schema.Types.ObjectId, ref:'cities' },
	//state:{ type:Schema.Types.ObjectId, ref:'state' },
    country:{ type:Schema.Types.ObjectId, ref:'countries'},
	zicode:String,
   	phone1:String,
	phone2:String,
	isprimaryaddress:{ type: Boolean, default: true },
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{type:Schema.Types.ObjectId, required:true},
	addeddate:{type: Date, default: Date.now},
	modifiedby:Schema.Types.ObjectId,
	modifieddate:{type: Date, default: Date.now}
	
});	*/

