/*
 * @Author: Sachin kumar
 * @Date:   12/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var countrySchema = new Schema({
  name : {
    type : String
  },
  code : {
    type : String
  },
  city : [],
  status : {
    type : Boolean,
    default : true
  }
});

module.exports = mongoose.model('countries', countrySchema);
