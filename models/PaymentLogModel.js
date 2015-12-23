var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var PaymentLogSchema = Schema({
    orderid:{ type:Schema.Types.ObjectId, ref:'orders' },
	paymentmodeid:{ type:Schema.Types.ObjectId, ref:'paymentmode' },
	transactionnumber:String,  
	transactiondate:Date,
	amount:String,
	issuccess:{ type: Boolean, default: true },
	transactionmessage:String,
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:{type:Schema.Types.ObjectId, required:true},
	addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	modifiedby:{type:Schema.Types.ObjectId, required:true},
	modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')}	
},{ versionKey: false });


module.exports = mongoose.model('paymentlog', PaymentLogSchema);