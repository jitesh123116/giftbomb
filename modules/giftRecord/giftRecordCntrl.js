/*
 * @Author: Sachin kumar
 * @Date:   16/june/2017
 */

var Promise = require('bluebird');
var GRM = require('./giftRecordModel');
var STATUS = require('../statusCode');
var storeModel = require('../store/storeModel');
var userModel = require('../users/userModel');
var giftTrackerModel = require('./giftTrackModel');
var NotificationManager = require("../utilities/notificationManager");
var UniversalFunctions = require("../utilities/universalFunctions");
var serverConstants = require("../utilities/serverConstants");
var async = require("async");
var giftCtrl = (function () {

	this.postgiftByUser = function (payloadData, callback) {

		var passData = [];
		async.series([

			(cb) => {
				var giftedToData = [];
				var query = {
					$or: []
				}
				for (var i = 0; i < payloadData["giftedTo"].length; i++) {
					query["$or"].push({
						"countryCode": payloadData["giftedTo"][i]["countryCode"],
						"phoneNumber": payloadData["giftedTo"][i]["phoneNumber"]
					});
				}
				userModel.find(query, {
					phoneNumber: 1,
					countryCode: 1,
					userName: 1,
					deviceType: 1,
					deviceToken: 1,
					_id: 1
				}, {
					lean: true
				}, (err, dbData) => {
					if (!err) {
						var data = dbData;
						if (data.length > 0) {
							for (var j = 0; j < data.length; j++) {
								var flag = false;
								for (var k = 0; k < payloadData["giftedTo"].length; k++) {
									if (data[j]["phoneNumber"] == payloadData["giftedTo"][k]["phoneNumber"] &&
										data[j]["countryCode"] == payloadData["giftedTo"][k]["countryCode"]
									) {

										flag = true;
										giftedToData.push({
											giftedTo: data[j]["_id"],
											deviceType: data[j]["deviceType"],
											deviceToken: data[j]["deviceToken"],
											fname: data[j]["userName"]["fname"]
										})
									} else {
										continue;
									}

								}
								if (flag == false) {
									giftedToData.push({
										phoneNumber: data[j]["phoneNumber"],
										countryCode: data[j]["countryCode"],
										contactName: data[j]["contactName"]
									})
								}
							}

						}
						passData = giftedToData;
						cb(null);
					} else {
						cb(err);
					}
				});

			},
			(cb) => {
				var dataToSave = [];
				for (var i = 0; i < passData.length; i++) {
					if (passData[i].hasOwnProperty("giftedTo")) {
						dataToSave.push({

							"giftedBy": payloadData["giftedBy"],
							"giftedTo": passData[i]["giftedTo"],
							"transactionId": payloadData["transactionId"],
							"paymentStatus": payloadData["paymentStatus"],
							"appUser": true,
							"uniqueCode": Date.now(),
							"giftAmount": Math.ceil(payloadData["giftAmount"] / functionData["get_data"].length),
							"message": payloadData["message"],
							"storeId": payloadData["storeId"],
							"giftedOn": UniversalFunctions.getDate(0),
							"redeemedAt": []

						});
					} else {
						dataToSave.push({

							"giftedBy": payloadData["giftedBy"],
							"sentData": {
								"phoneNumber": passData[i]["phoneNumber"],
								"countryCode": passData[i]["countryCode"],
								"contactName": passData[i]["contactName"]
							},
							"transactionId": payloadData["transactionId"],
							"paymentStatus": payloadData["paymentStatus"],
							"appUser": true,
							"uniqueCode": Date.now(),
							"giftAmount": Math.ceil(payloadData["giftAmount"] / functionData["get_data"].length),
							"message": payloadData["message"],
							"storeId": payloadData["storeId"],
							"giftedOn": UniversalFunctions.getDate(0),
							"redeemedAt": []
						});
					}
				}
				console.log(dataToSave, "----> data to sace");
				giftTrackerModel.insert(dataToSave, (err, db) => {
					console.log("save adata", err, db);
				})
			},
			(cb) => {

				for (var i = 0; i < passData.length; i++) {

					if (passData[i].hasOwnProperty("giftedTo")) {

						var NotifData = {
							'deviceToken': passData[i]["deviceToken"],
							'deviceType': "IOS",
							'dataToSend': {
								'notificationMessage': "Surprise! " + passData[i]["fname"] + " Giftbombed you!! 💭💃👯",
								'notificationType': 'GIFT_RECEIVED'
							},
						}
						NotificationManager.sendPush(NotifData, function (err, data) {
							if (!err) {
								console.log(err, data);
							}
						});

					}
				}
				cb(null);
			}
		], (err, data) => {
			if (!err) {
				callback(null, STATUS("SC200", "Gift Sent succssfully"));
			} else {
				callback(err);
			}
		})

	}
	this.addGiftRecord = function (req) {
		var promise = new Promise(function (resolve, reject) {
			if (!req.body.giftedBy) {
				reject({
					"error": "giftedBy is missing"
				});
			} else if (!req.body.giftedTo) {
				reject({
					"error": "giftedTo is missing"
				});
			} else if (!req.body.cardAmount) {
				reject({
					"error": "Card Amount is missing"
				});
			} else if (!req.body.storeName) {
				reject({
					"error": "Store Name is missing"
				});
			} else {
				var newRecord = new GRM();
				newRecord.giftedBy = req.body.giftedBy;
				newRecord.giftedTo = req.body.giftedTo;
				newRecord.toName = req.body.toName;
				newRecord.cardAmount = req.body.cardAmount;
				newRecord.redeemedAt = [];
				newRecord.storeName = req.body.storeName;
				newRecord.storeCategory = req.body.storeCategory;
				newRecord.giftedOn = req.body.giftedOn;
				giftCtrl.getStoreId(req.body.storeName)
					.then(function (data) {
						newRecord.storeId = data;
						newRecord.save(function (err, data) {
							if (err) {
								reject(err);
							} else {
								resolve(STATUS("SC200", "Gift Sent succssfully", data));
							}
						})
					}, function (err) {
						if (err == 0) {
							reject({
								"error": "Store not found with this name " + req.body.storeName
							});
						}
					})
			}
		})
		return promise;
	}
	this.getGiftRecord = function (params) {
		var promise = new Promise(function (resolve, reject) {
			if (params && params.idOrMobile) {
				GRM.find({
					"giftedTo": params.idOrMobile
				}).populate('giftedBy').exec(function (err, data) {
					if (err) {
						reject(err);
					} else if (data.length > 0) {
						resolve(STATUS("SC200", "list of record gifted To me", data));
					} else {
						GRM.find({
							"giftedBy": params.idOrMobile
						}).populate('giftedBy').exec(function (err, found) {
							if (err) {
								reject(err);
							} else if (found.length > 0) {
								resolve(STATUS("SC200", "list of record gifted By me", found));
							} else {
								resolve(STATUS("SC200", "No record Found", null));
							}
						})
					}
				})
			} else {
				GRM.find({}).populate('giftedBy').exec(function (err, found) {
					if (err) {
						reject(err);
					} else {
						resolve(STATUS("SC200", "list of all gift record", found));
					}
				})
			}
		})
		return promise;
	}
	this.updateGiftRecord = function (params, record) {
		var promise = new Promise(function (resolve, reject) {
			GRM.find({
				"_id": params.cardNumber
			}, function (err, data) {
				if (err) {
					reject(err);
				} else if (data.length > 0) {
					var cardAmount = data[0].cardAmount - record.redeemedAmount;
					var recObj = {};
					recObj.branchCode = record.branchCode;
					recObj.redeemedAmount = record.redeemedAmount;
					var count = data[0].transactionCount + 1;
					GRM.update({
						"_id": params.cardNumber
					}, {
						$set: {
							"cardAmount": cardAmount,
							"transactionCount": count
						},
						$push: {
							"redeemedAt": recObj
						}
					}, function (err, recordUpdated) {
						if (err) {
							reject(err);
						} else {
							resolve(STATUS("SC200", "Gift record updated"));
						}
					})
				} else {
					reject({
						"error": "Gift Record not found"
					});
				}
			})
		})
		return promise;
	}
	this.getStoreId = function (storeName) {
		var promise = new Promise(function (resolve, reject) {
			console.log("storeModel", storeName);
			storeModel.find({
				"accountInfo.storeName": {
					$regex: new RegExp("^" + storeName + "$", "i")
				}
			}, {
				"storeId": 1
			}, function (err, data) {
				if (err) {
					reject(err);
				} else if (data.length > 0) {
					resolve(data[0].storeId);
				} else {
					reject(0);
				}
			})
		})
		return promise;
	}


	this.thankyouCron = function () {
		var notify = [];
		async.series([

				(cb) => {
					var query = {
						"giftedOn": UniversalFunctions.getDate(serverConstants["url"]["THANKYOU_CRON_DAYS"])
					};
					var path = 'giftedTo';
					var select = 'deviceToken deviceType email'
					var populate = {
						path: path,
						match: {},
						select: select,
						options: {
							lean: true
						}
					};
					var options = {
						lean: true
					};

					var projection = {
						"giftedTo": 1
					}

					giftTrackerModel.find(query).select(select).populate(populate).setOptions({
						lean: true
					}).exec((err, dbResult) => {
						console.log(err,dbResult,"---> dbResult");
						var db = dbResult;
						if (!err) {
							for (var i = 0; i < db.length; i++) {
								notify.push({
									deviceToken: db[i]["deviceToken"],
									deviceType: "IOS",
									emailId: db[i]["email"]
								});
							}
							cb(null);

						} else {
							console.log("----> ERROR in thankyou cron", err);
							cb(null);
						}
					});
			},
				(cb) => {

					for (var i = 0; i < notify.length; i++) {

						var NotifData = {
							'deviceToken': notify[i]["deviceToken"],
							'deviceType': "IOS",
							'dataToSend': {
								'notificationMessage': "Have you sent a Thank you for your Giftbomb? How about returning the favor?",
								'notificationType': 'THANKYOU'

							},
						}
						NotificationManager.sendPush(NotifData, function (err, data) {
							if (!err) {
								console.log(err, data);

							}
						})
					}
					cb(null);
			}
		]


			, (err, data) => {
				if (!err) {
				
				};
			})
	}
	return this;
}());

module.exports = giftCtrl;