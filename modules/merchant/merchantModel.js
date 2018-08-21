/*
 * @Author: Sachin kumar
 * @Date:   08/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var merchantSchema = new Schema({
  email : {
    type : String,
    require : true
  },  
  password : {
    type : String,
    require : true
  }
});

module.exports = mongoose.model('merchant', merchantSchema);
