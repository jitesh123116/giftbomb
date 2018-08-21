/*
 * @Author: Sachin kumar
 * @Date:   08/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
  email : {
    type : String,
    require : true
  },
  phoneNumber : {
    type : String,
    require : true
  },
  password : {
    type : String,
    require : true
  },
  address : {
    type : String
  },
  city : {
    type : String
  },
  state : {
    type : String
  },
  country : {
    type : String
  },
  roles : {
    type : Array
  },
  passwordCode : {
    type : Number
  }
});

module.exports = mongoose.model('adminuser', adminSchema);
