/*
 * @Author: Sachin kumar
 * @Date:   09/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var db = require('../../config');

var connection = mongoose.createConnection(db.url);
autoIncrement.initialize(connection);

var branchSchema = new Schema({
  storeId : {
    type: Schema.Types.ObjectId,
    ref: 'stores'
  },
  branchId : {
    type : Number
  },
  phoneNumber : {
    type : String
  },
  city : {
    type : String
  },
  pincode : {
    type : String
  },
  country : {
    type : String
  },
  state : {
    type : String
  },
  address : {
    type : String
  },
  default : {
    type : Boolean,
    default : false
  },
  addedOn : {
    type : Date,
    default : Date.now
  },
  status : {
    type : Boolean,
    default : true
  },
  lat : {
    type : Number
  },
  lon : {
    type : Number
  },
  locationName : {
    type : String
  },
  branchLocation : {
    type:{type: String, enum: "Point", default: "Point"},
    coordinates: {type: [Number], default: [0, 0]}
  }
  
});
branchSchema.index({branchLocation: '2dsphere'});
branchSchema.plugin(autoIncrement.plugin, {
    model: 'branches',
    field: 'branchId',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('branches', branchSchema);
