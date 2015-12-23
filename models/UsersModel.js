var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var UsersSchema = Schema({
	/*_id:Schema.Types.ObjectId,*/
   	name: { type : String, required : true },  
   	userrole : [{type: Schema.Types.ObjectId, ref: 'userroles'}],
	mailid : { type: String, required : true },
	password : { type: String, required : true },
	facebookId: {type: String},
    access_token: {type: String},
    expiration:{type: String},
    lastloggedin:{type: String},
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false },
	addedby:Schema.Types.ObjectId,
	addeddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
	modifiedby:Schema.Types.ObjectId,
	modifieddate:{type: String, default: moment.utc().format('YYYY-MM-DD HH:mm:ss')}
	
},{ versionKey: false });

UsersSchema.statics.findOrCreate = function(filters, cb) {
        User = this;
        this.find(filters, function(err, results) {
            if(results.length == 0) {
                var newUser = new User();
                 var _newuser = new User({
				    'name': "sample",
				    'userrole' : "4edd40c86762e0fb12000003",
				    'mailid' : "aa@gmail.com",
				    'password' : "dfdfdfdf",
				    "facebookId":filters.facebookId,
				    'addedby':"4edd40c86762e0fb12000003",
				    'modifiedby':"4edd40c86762e0fb12000003"
			         });
                _newuser.save(function(err, doc) {
                    cb(err, doc)
                });
            } else {
                cb(err, results[0]);
            }
        });
    };

module.exports = mongoose.model('users', UsersSchema);