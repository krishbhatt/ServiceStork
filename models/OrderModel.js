var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var OrderDetailsSchema = Schema({
	  customeraddress:{ type:Schema.Types.ObjectId, ref:'customers.customeraddress' },
      servicepackage:{ type:Schema.Types.ObjectId, ref:'services.servicepackages' },
	  serviceid:{ type:Schema.Types.ObjectId, ref:'services' }, 
	  durationid:{ type:Schema.Types.ObjectId, ref:'duration' }, 
	  currencyid:{ type:Schema.Types.ObjectId, ref:'currencies' }, 
	  servicecost:String, 
	  taxid:{ type:Schema.Types.ObjectId, ref:'taxmaster' }, 
      taxpercentage:String,  
	  taxamount:String,
	  sevicerequireddate:String,
	  sevicerequiredtime:String,
	  serviceproviderid:{ type:Schema.Types.ObjectId, ref:'serviceproviders'},
	  servicestatus:Number
 });
 
 var OrderDetailAddOnsSchema = Schema({
      servicepackage:{ type:Schema.Types.ObjectId, ref:'services.servicepackages' },
	  serviceid:{ type:Schema.Types.ObjectId, ref:'services' }, 
	  durationid:{ type:Schema.Types.ObjectId, ref:'duration' }, 
	  currencyid:{ type:Schema.Types.ObjectId, ref:'currencies' }, 
	  servicecost:String, 
	  taxid:{ type:Schema.Types.ObjectId, ref:'taxmaster' }, 
      taxpercentage:String,  
	  taxamount:String,
	  totalamount:String
 });
 

var OrdersSchema = Schema({
	  ordercode:String,
      orderdate:Date,
      customerid:{ type:Schema.Types.ObjectId, ref:'customers' },   
      totalservicevalue:String,
      totaltaxamount:String,
      tipamount:String,
      promocode:String,
      promodiscountamount:String,
	  netamount:String,
      notes:String,
	  orderdetails:[OrderDetailsSchema],
	  orderdetailaddons:[OrderDetailAddOnsSchema],

      isvisible:{ type: Boolean, default: true },
      isactive:{ type: Boolean, default: true },
      isdeleted:{ type: Boolean, default: false },
      addedby:{type:Schema.Types.ObjectId, required:true},
      addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
      modifiedby:{type:Schema.Types.ObjectId, required:true},
      modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')}
},{ versionKey: false });


module.exports = mongoose.model('orders', OrdersSchema);