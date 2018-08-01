'use strict';
/**
 * Created by Priya Sethi.
 */

var async = require('async');
var gcm = require('node-gcm');
var Path = require('path');
var apns = require('apn');

var Config = require('../../config.js')

var sendPush = function (NotifData, callback) {
	var iosDeviceToken = [];
	iosDeviceToken.push(NotifData.deviceToken);
	var deviceType = NotifData.deviceType;
	var sendTo = "USER";
	var dataToSend = NotifData.dataToSend;
	var certificate = null;

	if (sendTo == 'USER') {
		console.log("hello");
		certificate = Path.resolve(".") + Config.pushConfig.user.iosApnCertificate;

	}
	var status = 1;
	var snd = 'notification.mp3';
	console.log('<<<<<<<<<', iosDeviceToken, certificate);
	var content = false;
//	var options = {
//		token: {
//			key: certificate,
//			keyId: certificate,
//			teamId: "developer-team-id"
//		},
//		production: false
//	};

	var options = {
		cert: certificate,
		certData: null,
		key: certificate,
		keyData: null,
		passphrase: 'click',
		ca: null,
		pfx: null,
		pfxData: null,
		//		port: 2195,
		rejectUnauthorized: true,
		enhanced: true,
		cacheLength: 100,
		autoAdjustCache: true,
		connectionTimeout: 0,
		ssl: true,
		debug: true,
		production: false
	};

	function log(type) {
		return function () {
			console.log("iOS PUSH NOTIFICATION RESULT: " + type);
		}
	}

	if (iosDeviceToken && iosDeviceToken.length > 0) {
		iosDeviceToken.forEach(function (tokenData) {
			try {

				var apnProvider = new apns.Provider(options);
				var note = new apns.Notification();

				note.expiry = Math.floor(Date.now() / 1000) + 3600;
				note.contentAvailable = content;
				note.sound = snd;
				note.alert = dataToSend.notificationMessage;
				note.payload={
					type:dataToSend.notificationType
				}
			
				note.newsstandAvailable = status;
				apnProvider.send(note, tokenData).then((result) => {

					console.log(JSON.stringify(result), "---> result");
					apnProvider.on('error', log('error'));
					apnProvider.on('transmitted', log('transmitted'));
					apnProvider.on('timeout', log('timeout'));
					apnProvider.on('connected', log('connected'));
					apnProvider.on('disconnected', log('disconnected'));
					apnProvider.on('socketError', log('socketError'));
					apnProvider.on('transmissionError', log('transmissionError'));
					apnProvider.on('cacheTooSmall', log('cacheTooSmall'));
				});
				callback(null);

				// Handle these events to confirm that the notification gets
				// transmitted to the APN server or find error if any

			} catch (e) {
				console.trace('exception occured', e)
				callback(null);

			}

		})
	}

}

module.exports = {

	sendPush: sendPush
}