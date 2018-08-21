/*
 * @Author: Sachin kumar
 * @Date:   16/june/2017
 */

var express = require('express');
var router = express.Router();

var multer = require('multer');
var NotificationManager = require("../utilities/notificationManager");
var NotificationModel = require("./notificationModel");
var UniversalFunctions = require("../utilities/universalFunctions");
var STATUS = require('../statusCode');
var async = require("async");




router.post("/send", function (req, res) {


	async.series([
		(cb) => {
			console.log("1");
			var NotifData = {
				'deviceToken': req.body.deviceToken,
				'deviceType': "IOS",
				'dataToSend': {
					'notificationMessage': "Yay!! Its " + req.body.name + " birthday! Send a surprise Giftbomb and make it even more special!! ",
					'notificationType': 'BIRTHDAYS'

				},
			}
			NotificationManager.sendPush(NotifData, function (err, data) {
				var newUser = new NotificationModel();
				newUser.userId = "59a3e5f8c34d2744a911a12e";
				newUser.notificationType = "BIRTHDAYS";
				newUser.notificationMessage = "Yay!! Its " + req.body.name + " birthday! Send a surprise Giftbomb and make it even more special!! ";
				newUser.date = UniversalFunctions.getDate(0);

				newUser.save((err, data) => {
					console.log("err,data", err, data)
				})
				cb(null);
			})

		},
		(cb) => {
			console.log("2");
			var NotifData = {
				'deviceToken': req.body.deviceToken,
				'deviceType': "IOS",
				'dataToSend': {
					'notificationMessage': "Surprise! " + req.body.name + " Giftbombed you!! 🎁💃👯",
					'notificationType': 'GIFT_RECEIVED'
				},
			}
			NotificationManager.sendPush(NotifData, function (err, data) {
				var newUser = new NotificationModel();
				newUser.userId = "59a3e5f8c34d2744a911a12e";
				newUser.notificationType = "GIFT_RECEIVED";
				newUser.notificationMessage = "Surprise! " + req.body.name + " Giftbombed you!! 🎁💃👯";
				newUser.date = UniversalFunctions.getDate(0);

				newUser.save((err, data) => {
					console.log("err,data", err, data)
				})
				cb(null);
			})

		},
		(cb) => {
			console.log("3");
			var NotifData = {
				'deviceToken': req.body.deviceToken,
				'deviceType': "IOS",
				'dataToSend': {
					'notificationMessage': "Knock, Knock ! Just a reminder that you have a Giftbomb burning a hole in your phone.",
					'notificationType': 'GIFT_NOT_USED'
				},
			}
			NotificationManager.sendPush(NotifData, function (err, data) {
				var newUser = new NotificationModel();
				newUser.userId = "59a3e5f8c34d2744a911a12e";
				newUser.notificationType = "GIFT_NOT_USED";
				newUser.notificationMessage = "Knock, Knock ! Just a reminder that you have a Giftbomb burning a hole in your phone.";
				newUser.date = UniversalFunctions.getDate(0);

				newUser.save((err, data) => {
					console.log("err,data", err, data)
				})
				cb(null);
			})

		},
		(cb) => {
			console.log("4");
			var NotifData = {
				'deviceToken': req.body.deviceToken,
				'deviceType': "IOS",
				'dataToSend': {
					'notificationMessage': "There's a Giftbomb about to explode!! 10.. 9..8 ",
					'notificationType': 'GIFT_TO_EXPIRE'
				},
			}
			NotificationManager.sendPush(NotifData, function (err, data) {
				var newUser = new NotificationModel();
				newUser.userId = "59a3e5f8c34d2744a911a12e";
				newUser.notificationType = "GIFT_TO_EXPIRE";
				newUser.notificationMessage = "There's a Giftbomb about to explode!! 10.. 9..8 ";
				newUser.date = UniversalFunctions.getDate(0);

				newUser.save((err, data) => {
					console.log("err,data", err, data)
				})
				cb(null);
			})

		},
		(cb) => {
			console.log("5");
			var NotifData = {
				'deviceToken': req.body.deviceToken,
				'deviceType': "IOS",
				'dataToSend': {
					'notificationMessage': "Have you sent a Thank you for your Giftbomb? How about  returning the favor?",
					'notificationType': 'THANKYOU'
				},
			}
			NotificationManager.sendPush(NotifData, function (err, data) {
				var newUser = new NotificationModel();
				newUser.userId = "59a3e5f8c34d2744a911a12e";
				newUser.notificationType = 'THANKYOU';
				newUser.notificationMessage = "Have you sent a Thank you for your Giftbomb? How about  returning the favor?";
				newUser.date = UniversalFunctions.getDate(0);

				newUser.save((err, data) => {
					console.log("err,data", err, data)
				})
				cb(null);
			})

		}

	], (err, data) => {
		res.status(200).send({});
	})


});

router.get("/admin/notificationList", function (req, res) {
	
	NotificationModel.find({}, {},{lean:true},(err,data)=>{
		if(!err){
			res.status(200).send(STATUS("SC200", "lIST", data));
		}else{
			res.status(400).send(err);
		}
	})
})
router.post("/getList", function (req, res) {
	var userId = req.body.userId;
	NotificationModel.find({
		userId: req.body.userId
	}, {}, {}, (err, dbDtaa) => {
		if (!err) {
			res.status(200).send(STATUS("SC200", "lIST", dbDtaa));
		} else {
			res.send(err);
		}
	})

})



module.exports = router;