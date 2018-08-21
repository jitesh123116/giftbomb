/*
 * @Author: Sachin kumar
 * @Date:   16/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var giftSchema = new Schema({
  giftedBy : {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  giftedTo : {
    type : String
  },
  toName : {
    type : String
  },
  cardAmount : {
    type : Number
  },
  redeemedAt : [{
    branchCode : {
      type : String
    },
    redeemedAmount : {
      type : Number
    },
    redeemedDate : {
      type : Date,
      default : Date.now
    }
  }],
  storeName : {
    type : String
  },
  storeId : {
    type : Number
  },
  storeCategory : {
    type : String
  },
  giftedOn : {
    type : Date,
    default : Date.now
  },
  transactionCount : {
    type : Number,
    default : 0
  }
});
module.exports = mongoose.model('giftrecords', giftSchema);
