var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');


var licenceSchema = new Schema({
    licensenumber: String, 
    yearlicensed: Number,
    licensedetails: String
});



var ServiceProviderAvailibilitySchema = Schema({
      serviceprovider:{ type:Schema.Types.ObjectId, ref:'serviceproviders' },
      workingdate: Date,
      fromtime: String,
      totime:String,  
	  note:String
 });

var ServiceProvidersSchema = Schema({
     // userid:{type:Schema.Types.ObjectId},
      name:{ type : String, required : true },
      ssnumber:String,
      image:String,
      phone1:String,  
      phone2:String,
      email:{ type : String, required : true },
      streetaddress:String,  


      city:{ type:Schema.Types.ObjectId, ref:'cities' },
      country:{ type:Schema.Types.ObjectId, ref:'countries'},


      region:{ type:Schema.Types.ObjectId, ref:'regions' },
	  subregion:{ type:Schema.Types.ObjectId, ref:'subregions' },
      zip:String,
      hiredate:{type:Date,required : true },
      hireby:String,
      dateofbirth:String,
      insuranceprovider:String,
      renewaldate:{type:Date },
      notes:String,
      situationperformed:String,
      specificmodalities:String,
      maxassignmentdistanceinmile:String,
      willingforminnumberofassignment:{ type: Boolean, default: false }, 
      minnumberofassignment:Number,

      profilerating:{ type : Number, default: 0 },
      ratingindeeptissueskill:{ type : Number, default: 0  },
 	  supplies:[{ type:Schema.Types.ObjectId, ref:'supplies' }],
      assignmenttypes:[{ type:Schema.Types.ObjectId, ref:'assignmenttypes' }],	  
      services:[{ type:Schema.Types.ObjectId, ref:'services' }],      
      servedregions:[{ type:Schema.Types.ObjectId, ref:'regions' }], 
      licences:[licenceSchema],
	  serviceprovideravailibility:[ServiceProviderAvailibilitySchema],

      isvisible:{ type: Boolean, default: true },
      isactive:{ type: Boolean, default: true },
      isdeleted:{ type: Boolean, default: false },
      addedby:{type:Schema.Types.ObjectId, required:true},
      addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
      modifiedby:{type:Schema.Types.ObjectId, required:true},
      modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')}
},{ versionKey: false });


module.exports = mongoose.model('serviceproviders', ServiceProvidersSchema);