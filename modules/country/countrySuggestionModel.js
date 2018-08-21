/*
 * @Author: Sachin kumar
 * @Date:   12/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var suggestionSchema = new Schema({
  name : {
    type : String
  },
  email : {
    type : String
  },
  country : {
    type : String
  },
  city : {
    type : String
  }
});

module.exports = mongoose.model('countrysuggestion', suggestionSchema);
