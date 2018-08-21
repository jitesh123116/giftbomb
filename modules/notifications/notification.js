/*
 * @Author: Sachin kumar
 * @Date:   16/june/2017
 */

var express = require('express');
var router = express.Router();

var multer = require('multer');
var NotificationManager= require("../utilities/notificationManager")


router.get("/send", function (req, res) {
	var NotifData = {
		'deviceToken': "20811D101478DF3745C72DDD62C042E6A3B2469E9943714A25B7836E2777A00E",
		'deviceType':"IOS",
		'dataToSend': {
			'notificationMessage': "Yay!! Its your birthday..",
			'notificationType': 'BIRTHDAYS'
			
		},
	}
	NotificationManager.sendPush(NotifData,function(err,data){
		if(!err){
			console.log(err,data);
		}
	})
})



module.exports = router;