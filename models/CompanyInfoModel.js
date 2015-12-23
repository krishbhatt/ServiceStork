var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var ComapanyInfoSchema = Schema({
      /*_id:Schema.Types.ObjectId,*/
      companyname: { type : String, required : true },
      firstname: { type : String},
      lastname: { type : String },
      title:{ type: String},
      phone: { type : String },
      email: { type : String },
      streetaddress: { type : String },
      city:{type:Schema.Types.ObjectId, ref:"cities"},
      stateid: { type : String},
      country: {type:Schema.Types.ObjectId, ref:"countries"},
      zipcode: { type : String},
      note:{ type: String},
      companylogo:{ type: String},
      isactive:{ type: Boolean, default: true },
      isdeleted:{ type: Boolean, default: false },
      addedby:{type:Schema.Types.ObjectId, required:true},
      addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
      modifiedby:Schema.Types.ObjectId,
      modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')}
      
},{ versionKey: false });

module.exports = mongoose.model('companyinfoes', ComapanyInfoSchema);