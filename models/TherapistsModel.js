var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;

var TherapistsSchema = Schema({
      _id:Schema.Types.ObjectId,
      name:{ type : String, required : true }, 
      imagename:String,
      phone1:String,  
      phone2:String,
      email:String,
      StreetAddress:String,  
      region:[RegionsSchema],
      zip:String,
      notes:String,
      situationperformed:String,
      specificmodalities:String,
      maxAssignmentdistanceinmile:String,
      willingforminnumberofassignment:{ type: Boolean, default: false }, 
      minnumberofassignment:Number,
      profilerating:Number,
      ratingindeeptissueskill:Number,
      isvisible:{ type: Boolean, default: true },
      services:[ServicesSchema], 
      supplies:[SuppliesServicesSchema],
      assignmenttypes:[AssignmentTypesSchema],
      servedregions:[RegionsSchema],                	
      isactive:{ type: Boolean, default: true },
      isdeleted:{ type: Boolean, default: false },
      addedby:Schema.Types.ObjectId,
      addeddate:{type: Date, default: Date.now},
      modifiedby:Schema.Types.ObjectId,
      modifieddate:{type: Date, default: Date.now}
	
});

module.exports = mongoose.model('therapists', TherapistsSchema);