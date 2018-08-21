/*
 * @Author: Priya Sethi
 * @Date:   12/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
  userId : {
    type : String
  },
  notificationType : {
    type : String
  },
  notificationMessage : {type:String},
  read:{type:Boolean, default:false},
	date:{type:Date}
	
});

module.exports = mongoose.model('notificationSchema', notificationSchema);