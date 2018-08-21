/*
 * @Author: Vinay kumar
 * @Date:   17/july/2017
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
  originalValue : {
    type :  Number
  },
  offerValue : {
    type :  Number
  },
  promotionName : {
    type : String
  },
  startDate : {
    type : Date
  },
  endDate : {
    type : Date
  },
  requestedOn : {
    type : Date,
    default : Date.now
  },
	promotionLogo:{type:String},
	promotionCouponCount:{type:Number,default:0},
	promotionCouponUsed:{type:Number, default:0}
},{strict:false});
requestSchema.plugin(autoIncrement.plugin, {
    model: 'promotions',
    field: 'promotionId',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('promotions', requestSchema);
