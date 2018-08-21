/*
 * @Author: Sachin kumar
 * @Date:   15/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var db = require('../../config');

// var connection = mongoose.createConnection(db.url);
// autoIncrement.initialize(connection);

var featuredListSchema = new Schema({
  listName : {
    type : String,
    require : true
  },
  city : {
    type : String,
    require : true
  },
  listItem : [{type: Schema.Types.ObjectId, ref: 'branches'}],
  startDate : {
    type : Date,
    default : Date.now
  },
  endDate : {
    type : Date
  },
  status : {
    type : Boolean,
    default : true
  }
});
// featuredListSchema.plugin(autoIncrement.plugin, 'featuredList');
module.exports = mongoose.model('featuredlists', featuredListSchema);
