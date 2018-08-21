/*
 * @Author: Sachin kumar
 * @Date:   16/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var giftTrackModel = new Schema({
	giftedBy: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	giftedTo: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	transactionId:{type:String, default:null},
	paymentStatus:{type:String},
	appUser:{type:Boolean, default:false},
	uniqueCode:{type:String},
	sentData:{
		phoneNumber:{type:String},
		countryCode:{type:String},
		name:{type:String}
	},
	giftAmount: {
		type: Number
	},
	message: {
		type: String
	},
	multimedia:{
		type:String
	},
	redeemedAt: [{
		branchCode: {
			type: String
		},
		redeemedAmount: {
			type: Number
		},
		redeemedDate: {
			type: Date,
			default: Date.now
		}
  }],
	storeId: {
		type: Number
	},
	giftedOn: {
		type: Date,
		default: Date.now
	}
});
module.exports = mongoose.model('giftTrackModel', giftTrackModel);