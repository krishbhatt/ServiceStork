var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var ServicePackageAddonSchema=Schema({
	duration:{type:Schema.Types.ObjectId, ref:"durations"},
	currency:{type:Schema.Types.ObjectId, ref:"currencies"},
	cost: { type : Number, required : true },
	note: { type : String, required : true }
});

var ServicePackageSchema=Schema({
	region:{type:Schema.Types.ObjectId, ref:"regions"},
	locationtype:{type:Schema.Types.ObjectId, ref:"servicelocationtypes"},
	duration:{type:Schema.Types.ObjectId, ref:"durations"},
	currency:{type:Schema.Types.ObjectId, ref:"currencies"},
	cost: { type : Number, required : true },
	note: { type : String, required : true },
	servicepackageaddons:[ServicePackageAddonSchema]
});




var ServicesSchema = Schema({
   	name: { type : String, required : true },
	serviceimage:{ type:String},
	regions:[{type:Schema.Types.ObjectId,ref:"regions"}],
	servicepackages:[ServicePackageSchema],
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{type:Schema.Types.ObjectId, required:true},
	addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	modifiedby:{type:Schema.Types.ObjectId, required:true},
	modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')}	
},{ versionKey: false });


function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}
module.exports = mongoose.model('services', ServicesSchema);