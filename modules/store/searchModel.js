

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = require('../../config');
var connection = mongoose.createConnection(db.url);

var searchSchema = new Schema({
	searchString : {
		type : String
	},
	searchCount : {
		type : Number, 
		default : 0
	}
})
module.exports = mongoose.model('searchStoreCounts', searchSchema);
