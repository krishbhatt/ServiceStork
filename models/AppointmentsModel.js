var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;

var AppointmentsSchema = Schema({
      _id:Schema.Types.ObjectId,
      therapistid: Schema.Types.ObjectId, 
      customerid:Schema.Types.ObjectId,
      appointmentdate:{type: Date, default: Date.now},
      appointmentduration:Number,
      amount:String,
      isconfirmed:{ type: Boolean, default: false },
      status:{ type: Boolean, default: false },
      note:String,
      clientfeedback,String,   	
      isactive:{ type: Boolean, default: true },
      isdeleted:{ type: Boolean, default: false },
      addedby:Schema.Types.ObjectId,
      addeddate:{type: Date, default: Date.now},
      modifiedby:Schema.Types.ObjectId,
      modifieddate:{type: Date, default: Date.now}
	
});

module.exports = mongoose.model('appointments', AppointmentsSchema);