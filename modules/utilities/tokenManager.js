/**
 * Created by Priya.
 */


'use strict';
var Jwt = require('jsonwebtoken');
var async = require('async');
var userModel = require('../users/userModel');


var setTokenInDB = function (userId, loginType, token, callback) {

	var criteria = {
		_id: userId
	};
	var setQuery = {
		// accessToken : tokenToSave
		$set: {
			"accessToken": token
		}
	};

	userModel.update(criteria, setQuery, {
		lean: true,
		new: true
	}, (err, data) => {
		if (!err) {
			callback(null);
		} else {
			callback(err);
		}
	});

}
var setToken = function (tokenData, callback) {
	
	console.log("token data", tokenData);

	if (!tokenData.id) {


		callback("Error in set token");
		
	} else {
		var tokenToSend = Jwt.sign(tokenData, "sUPerSeCuREKeY&^$^&$^%$^%7782348723t4872t34Ends");

		tokenData.loginType = tokenData.loginType ? tokenData.loginType : "APP";
		setTokenInDB(tokenData.id, tokenData.loginType, tokenToSend, function (err, data) {

			callback(err, {
				accessToken: tokenToSend
			})
		});
	}
	
};

var getTokenFromDB = function (userId, token, ip, loginType, callback) {

	var userData = null;
	var criteria = {
		"_id": userId,
		"accessToken": token
	};


	userModel.find(criteria, {}, {
		lean: true
	}, function (err, dataAry) {
		console.log("err, dataAry", err, dataAry);
		if (err) {
			cb(err)
		} else {
			if (dataAry && dataAry.length > 0) {
				userData = dataAry[0];
				userData.id = userData._id;
				userData.ip = ip;
				userData.loginType = loginType;
				callback(null, {
					"userData": userData
				});
			} else {
				callback(
					"Error in token get"
				);
			}
		}

	});

}


var verifyToken = function (token, callback) {

	var response = {
		valid: false
	};
	Jwt.verify(token, "sUPerSeCuREKeY&^$^&$^%$^%7782348723t4872t34Ends", function (err, decoded) {

		if (err) {
			callback(err)
		} else {
			getTokenFromDB(decoded.id, token, decoded.ip, decoded.loginType, callback);
		}
	});
};

module.exports = {
	setToken: setToken,
	verifyToken: verifyToken
}