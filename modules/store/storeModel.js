/*
 * @Author: Sachin kumar
 * @Date:   09/june/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var db = require('../../config');

var connection = mongoose.createConnection(db.url);
autoIncrement.initialize(connection);

var storeSchema = new Schema({
  contactInfo : {
    firstName : {
      type : String
    },
    lastName : {
      type : String
    },
    contactNumber : {
      type : String
    },
    email : {
      type : String
    },
    password : {
      type : String
    }
  },
  storeId : {
    type : Number
  },
  image : {
    type : String
  },
  logo : {
    type : String
  },
  likes : [],
  accountInfo : {
    storeName : {
      type : String
    },
		storeLogo:{
			type:String
		},
    category : {
      type : String
    },
    website : {
      type : String,
      default : ""
    },
    tagLine : {
      type : String,
      default : ""
    },
    state : {
      type : String
    },    
    country : {
      type : String
    },
    storeThumbnail : {
      type : String,
      default : ""
    }
  },
  bankAccountInfo : {
    accountNumber : {
      type : Number
    },
    bankName : {
      type : String
    },
    routingNumber : {
      type : String
    },
    bankAddress : {
      type : String
    },
    nameOfTheAccount : {
      type : String
    }
  },
  designInfo : {
    storeLogo : {
      type : String
    },
    backGroundColor : {
      type : String
    },
    fontColor : {
      type : String
    }
  },  
  branch : {
    type : Array,
    default : []
  },
  passwordCode : {
    type : Number
  }
});
storeSchema.plugin(autoIncrement.plugin, {
    model: 'stores',
    field: 'storeId',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('stores', storeSchema);
