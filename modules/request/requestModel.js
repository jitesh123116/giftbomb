/*
 * @Author: Sachin kumar
 * @Date:   10/july/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var db = require('../../config');
var connection = mongoose.createConnection(db.url);
autoIncrement.initialize(connection);


var requestSchema = new Schema({
  storeId : {
    type: Schema.Types.ObjectId,
    ref: 'stores'
  },
  requestId : {
    type : Number
  },
  branchId : {
    type: Schema.Types.ObjectId,
    ref: 'branches'
  },
  promotionName : {
   type : String
  },
  updateData : {
    type : Object
  },
  requestType : {
    type : String
  },
  requestedOn : {
    type : Date,
    default : Date.now
  },
  status : { /** "0"=>Pending,1=>Accept, 2=>Decline   **/
    type : Number,
    default : 0
  }
},{strict:false});
requestSchema.plugin(autoIncrement.plugin, {
    model: 'requests',
    field: 'requestId',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('requests', requestSchema);

