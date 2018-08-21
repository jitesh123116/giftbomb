/*
 * @Author: Sachin kumar
 * @Date:   09/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var serverConstants = require('../serverConstants');

var userSchema = new Schema({
  username : {
    fname : {
      type : String
    },
    lname : {
      type : String
    }
  },
  email : {
    type : String
  },
  image : {
    type : String
  },
  phoneNumber : {
    type : String,
    require : true
  },
  countryCode : {
    type : String
  },
  country : {
    type : String
  },
  otp : {
    type : Number
  },
  contacts : {
    type : Array,
    default : []
  },
  gender : {
    type : String
  },
  dob : {
    type : Date
  },
  city : {
    type : String,
    default : ''
  },
  lat : {
    type : String,
    default : ''
  },
  lon : {
    type : String,
    default : ''
  },
  favourite:[{
    type: Schema.Types.ObjectId,
    ref: 'stores'
  }],
  isPublic : {
    type : Boolean,
    default : true
  },
  newUser : {
    type : Boolean,
    default : false
  },
  status : {
    type : Boolean,
    default : true
  },
  deviceType : {
    type : String
  },
  deviceId : {
    type : String
  },
  deviceToken : {
    type : String
  },
	accountStatus: {
		type: String,
		enum: [
      serverConstants["account_status"]['ACTIVE'],
			serverConstants["account_status"]['DELETED_BY_USER'],
			serverConstants["account_status"]['DELETED_BY_ADMIN']
    ]
	},
	accessToken:{type:String, default:""},
	contactList:[{
		phoneNumber:{type:String},
		countryCode:{type:String}
	}],
	wishlistPublic:{type:Boolean, default:true},
	notification:{type:Boolean,default:true}
},{strict:false});

module.exports = mongoose.model('users', userSchema);
