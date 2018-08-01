/*
 * @Author: Sachin kumar
 * @Date:   19/june/2017
 */

var Promise = require('bluebird');
var userModel = require('../users/userModel');
var storeModel = require('../store/storeModel');
var branchModel = require('../store/branchModel');
var giftRecordModel = require('../giftRecord/giftRecordModel');
var featuredListModel = require('../featuredList/featuredListModel');
var STATUS = require('../statusCode');
var async = require('async');
var dateTime = require('node-datetime');
var serverConstants = require('../serverConstants');
var categories = serverConstants["categories"];
var commonCntrl = (function () {
	this.getUserFullData = function (params) {
		var promise = new Promise(function (resolve, reject) {
			var result = {};
			console.log("1111")

			userModel.find({
				"_id": params.id
			}).populate("favourite").exec(function (err, data) {
				if (err) {
					reject(err);
				} else {
					result.userData = [];
					result.FeaturedList = [];
					result.giftRecord = [];
					result.categories = [];
					if (data.length > 0) {
						if (data[0].favourite && data[0].favourite.length > 0) {
							async.eachSeries(data[0].favourite, function (item, cb) {
								storeModel.find({
									"_id": item._id
								}, {}, {
									lean: true
								}, function (err, store) {
									console.log(err, JSON.stringify(store), "check store logo");
									if (err) {
										cb();
									} else {
										var temp = {};
										temp.image = '';
										temp.likeFlag = false;
										temp.storeName = store[0].accountInfo.storeName;
										temp.storeId = store[0]._id;
										temp.likes = store[0].likes.length;
										temp.storeLogo = serverConstants.url.BASEURl + "/uploads/" + store[0].accountInfo.storeLogo;
										temp.category = store[0].accountInfo.category;

										for (var i = 0; i < categories.length; i++) {
											if (temp.category == categories[i]["plural"]) {
												temp.category = categories[i]["singular"];
												temp.pluralCategory = categories[i]["plural"];
											} else {
												continue;
											}
										}
										temp.image = (store[0].accountInfo.storeThumbnail !== undefined && store[0].accountInfo.storeThumbnail) ? serverConstants.url.BASEURl + "/uploads/" + store[0].accountInfo.storeThumbnail : '';
										temp.branchId = item.branchId;
										if (store[0].likes.indexOf(params.id) > -1) {
											temp.likeFlag = true;
										}
										result.userData.push(temp);
										cb();
									}
								})
							})
						}
						if (params && !params.city) {
							params.city = 'dummy';
						}


						commonCntrl.getFeaturedList(params.city, params.id)
							.then(function (featuredList) {
								console.log("=====featuredList", featuredList);
								//return;


								result.FeaturedList = featuredList;
								commonCntrl.giftRecord(params.id)
									.then(function (giftRecord) {
										result.giftRecord = giftRecord;
										commonCntrl.getCategories(params.city)
											.then(function (categories) {
												result.categories = categories;
												resolve(STATUS("SC200", "get userDetail, recent transaction, featuredList and categories", result));
											}, function (err) {
												reject(err);
											})
									}, function (err) {
										reject(err);
									})
							}, function (err) {
								reject(err)
							})
					} else {
						reject({
							"error": "No user exist OR No favourite added for this user"
						});
					}
				}
			})
		})
		return promise;
	}
	this.getFeaturedList = function (city, id) {
		var promise = new Promise(function (resolve, reject) {
			var featuredList = [];
			var temp = {};
			var dateUTC = new Date();
			var dateUTC = dateUTC.getTime()
			var dateIST = new Date(dateUTC);
			//date shifting for IST timezone (+5 hours and 30 minutes)
			dateIST.setHours(dateIST.getHours() + 5);
			dateIST.setMinutes(dateIST.getMinutes() + 30);
			var currentDate = dateIST;



			featuredListModel.find({
				"status": true,
				$or: [{
					startDate: {
						$lte: currentDate
					},
					endDate: {
						$gte: currentDate
					}
				}, {
					startDate: {
						$lte: currentDate
					},
					endDate: undefined
				}],
				"city": {
					$regex: new RegExp("^" + city + "$", "i")
				}
			}).populate({
				path: 'listItem',
				options: {
					limit: 10
				}
			}).exec(function (err, data) {

				if (err) {
					console.log("=====err", err);


					reject(err);
				} else if (data.length > 0) {
					console.log("=====success", data);

					async.eachSeries(data, function (item, cb) {

						var obj = {};
						obj[item.listName] = [];
						async.eachSeries(item.listItem, function (storeItem, callback) {
							storeModel.find({
								"_id": storeItem.storeId
							}, {}, {
								lean: true
							}, function (err, store) {
								if (err) {
									callback();
								} else if (store.length > 0) {
									var temp = {};
									temp.image = '';
									temp.likeFlag = false;
									temp.storeName = (store[0].accountInfo !== undefined && store[0].accountInfo.storeName) ? store[0].accountInfo.storeName : '';
									temp.storeId = store[0]._id;
									temp.storeLogo = (store[0].accountInfo.storeLogo !== undefined && store[0].accountInfo.storeLogo) ? serverConstants.url.BASEURl + "/uploads/" + store[0].accountInfo.storeLogo : '';
									temp.likes = store[0].likes.length;
									temp.category = (store[0].accountInfo !== undefined && store[0].accountInfo.category) ? store[0].accountInfo.category : '';
									//temp.image = 'http://54.152.168.199:3000/images/store/mcdonalds.png';
									temp.image = (store[0].accountInfo.storeThumbnail !== undefined && store[0].accountInfo.storeThumbnail) ? serverConstants.url.BASEURl + "/uploads/" + store[0].accountInfo.storeThumbnail : '';
									for (var i = 0; i < categories.length; i++) {
										if (temp.category == categories[i]["plural"]) {
											temp.category = categories[i]["singular"];
											temp.pluralCategory = categories[i]["plural"];
										} else {
											continue;
										}
									}
									temp.branchId = item.listItem[0].branchId;
									if (id && store[0].likes.indexOf(id) > -1) {
										temp.likeFlag = true;
									}
									obj[item.listName].push(temp);
									callback();
								} else {
									callback();
								}
							})
						}, function () {
							featuredList.push(obj);
							cb();
						})
					}, function () {
						resolve(featuredList);
					})
				} else {
					console.log("=====success1", featuredList);

					resolve(featuredList);
				}
			})
		})
		return promise;
	}
	this.giftRecord = function (id) {
		var promise = new Promise(function (resolve, reject) {
			var giftRecord = [];
			giftRecordModel.find({
				"giftedBy": id
			}).limit(5).exec(function (err, data) {
				if (err) {
					reject(err);
				} else if (data.length > 0) {
					async.eachSeries(data, function (item, cb) {
						var temp = {};
						temp.image = serverConstants.url.BASEURl + "/images/store/mcdonalds.png";
						temp.storeName = item.storeName;
						temp.storeId = item.storeId;
						giftRecord.push(temp);
						cb();
					}, function () {
						resolve(giftRecord);
					})
				} else {
					resolve(giftRecord);
				}
			})
		})
		return promise;
	}
	this.getCategories = function (city) {
		var promise = new Promise(function (resolve, reject) {
			var category = [];
			branchModel.find({
				"city": city
			}, function (err, cityData) {
				if (err) {
					reject(err);
				} else {
					var idArray = [];
					cityData.forEach(function (item) {
						idArray.push(item.storeId);
					})
					storeModel.aggregate([
						{
							"$match": {
								"_id": {
									"$in": idArray
								}
							}
						},
						{
							"$group": {
								"_id": {
									"category": "$accountInfo.category"
								},
								"count": {
									$sum: 1
								}
							}
						},
						{
							"$match": {
								count: {
									$gte: 1
								}
							}
						}
          ], function (err, data) {
						if (err) {
							reject(err);
						} else if (data.length > 0) {
							async.eachSeries(data, function (item, cb) {
								var temp = {};

								temp.name = item._id.category;
								for (var i = 0; i < categories.length; i++) {

									if (temp.name == categories[i]["plural"]) {
										temp.category = categories[i]["singular"];

									} else {

										continue;
									}
								}
								temp.image = serverConstants.url.BASEURl + "/images/category/" + temp.category + ".png";

								category.push(temp);
								cb();
							}, function () {
								resolve(category);
							})
						} else {
							resolve(category);
						}
					})
				}
			})
		})
		return promise;
	}
	this.getUserWithFeatured = function (payload) {
		var promise = new Promise(function (resolve, reject) {
			console.log(payload, "----> payload data---->");
			var userid = (payload.userid !== undefined && payload.userid) ? payload.userid : '';
			var result = {};
			if (payload && !payload.city) {
				payload.city = 'dummy';
			}

			console.log("query.mobile", payload.mobile);
			var mobiles = [];
			if (payload && payload.mobile) {
				if (payload.mobile.indexOf(',') > -1) {
					mobiles = payload.mobile.split(',');
				} else {
					mobiles.push(payload.mobile);
				}
			}

			var query = {
				"$or": []
			}
			for (var i = 0; i < mobiles.length; i++) {
				console.log(mobiles[i]);
				var splitarray = mobiles[i].split(" ");
				console.log(splitarray);
				query["$or"].push({
					"phoneNumber": splitarray[1],
					"countryCode": splitarray[0]
				})
			}
			console.log("===> query data ", JSON.stringify(query));
			if (mobiles.length > 0) {
				result.userData = [];
				for (var i = 0; i < mobiles.length; i++) {
					var obj = {};
					userModel.find(query).populate("favourite").exec(function (err, data) {

						if (err) {
							reject(err);
						} else if (data.length > 0) {
							var key = data[0].username.fname ? data[0].username.fname : 'NA';
							if (key != 'NA' && data[0].username.lname != undefined) {
								key = key + " " + data[0].username.lname;
							}
							obj['name'] = key;
							obj['stores'] = [];
							async.eachSeries(data[0].favourite, function (item, cb) {
								storeModel.find({
									"_id": item._id
								}, {}, {
									lean: true
								}, function (err, store) {
									if (err) {
										cb();
									} else if (store.length > 0) {
										var temp = {};
										temp.likeFlag = false;
										temp.storeName = store[0].accountInfo.storeName;
										temp.storeId = store[0]._id;
										temp.likes = store[0].likes.length;
										temp.category = store[0].accountInfo.category;
										for (var i = 0; i < categories.length; i++) {
											console.log("testing", temp.category, categories[i]["plural"], temp.category == categories[i]["plural"]);
											if (temp.category == categories[i]["plural"]) {
												temp.category = categories[i]["plural"];
												temp.singularCategory = categories[i]["singular"];
											} else {
												continue;
											}
										}
										temp.image = (store[0].accountInfo.storeThumbnail !== undefined && store[0].accountInfo.storeThumbnail) ? serverConstants.url.BASEURl + "/uploads/" + store[0].accountInfo.storeThumbnail : '';
										temp.branchId = item.branchId;
										if (userid && store[0].likes.indexOf(userid) > -1) {
											temp.likeFlag = true;
										}
										obj['stores'].push(temp);
										cb();
									} else {
										result.userData = [];
										cb();
									}
								})
							}, function () {
								result.userData.push(obj);
							})
							commonCntrl.getFeaturedList(payload.city, userid)
								.then(function (featuredList) {
									result.featuredList = featuredList;
									resolve(STATUS("SC200", "get userDetail and featuredList", result));
								}, function (err) {
									reject(err);
								})
						} else {
							commonCntrl.getFeaturedList(payload.city, userid)
								.then(function (featuredList) {
									result.featuredList = featuredList;
									resolve(STATUS("SC200", "get userDetail and featuredList", result));
								}, function (err) {
									reject(err);
								})
						}
					})
				}
			} else {
				commonCntrl.getFeaturedList(payload.city, userid)
					.then(function (featuredList) {
						result.featuredList = featuredList;
						resolve(STATUS("SC200", "get userDetail and featuredList", result));
					}, function (err) {
						reject(err);
					})
			}
		})
		return promise;
	}

	/**
	 *@getAllFeaturedList
	 */
	this.getAllFeaturedList = function (params) {

			var promise = new Promise(function (resolve, reject) {
				var featuredList = [];
				var temp = {};
				var dateUTC = new Date();
				var dateUTC = dateUTC.getTime()
				var dateIST = new Date(dateUTC);
				//date shifting for IST timezone (+5 hours and 30 minutes)
				dateIST.setHours(dateIST.getHours() + 5);
				dateIST.setMinutes(dateIST.getMinutes() + 30);
				var currentDate = dateIST;

				if (!params.id) {
					resolve({
						"error": "User id is required"
					});
				} else if (!params.city) {
					resolve({
						"error": "City name is required"
					});
				} else if (!params.featuredName) {
					resolve({
						"error": "List name is required"
					});
				} else {
					console.log("params.featuredName", params.featuredName);
					console.log("params.city", params.city);
					featuredListModel.find({
						"status": true,
						$or: [{
							startDate: {
								$lte: currentDate
							},
							endDate: {
								$gte: currentDate
							}
					}, {
							startDate: {
								$lte: currentDate
							},
							endDate: undefined
					}],
						"city": {
							$regex: new RegExp("^" + params.city + "$", "i")
						},
						"listName": params.featuredName
					}).populate('listItem').exec(function (err, data) {
						console.log("err", err);
						console.log("data", data);
						//return;
						if (err) {
							resolve(STATUS("SC202", err));
						} else if (data.length > 0) {

							async.eachSeries(data, function (item, cb) {
								var obj = [];
								console.log("item", item);
								//obj[item.listName] = [];
								async.eachSeries(item.listItem, function (storeItem, callback) {
									storeModel.find({
										"_id": storeItem.storeId
									}, {}, {
										lean: true
									}, function (err, store) {
										if (err) {
											callback();
										} else if (store.length > 0) {
											var temp = {};
											temp.image = '';
											temp.storeName = (store[0].accountInfo !== undefined && store[0].accountInfo.storeName) ? store[0].accountInfo.storeName : '';
											temp.storeId = store[0]._id;
											temp.category = (store[0].accountInfo !== undefined && store[0].accountInfo.category) ? store[0].accountInfo.category : '';
											temp.image = (store[0].accountInfo !== undefined && store[0].accountInfo.storeLogo !== undefined) ? serverConstants.url.BASEURl + "/uploads/" + store[0].accountInfo.storeLogo : '';

											for (var i = 0; i < categories.length; i++) {
												console.log("testing", temp.category, categories[i]["plural"], temp.category == categories[i]["plural"]);
												if (temp.category == categories[i]["plural"]) {
													temp.category = categories[i]["singular"];
													temp.pluralCategory = categories[i]["plural"];
												} else {
													continue;
												}
											}
											featuredList.push(temp);
											callback();
										} else {
											callback();
										}
									})
								}, function () {
									//featuredList.push(obj);
									cb();
								})
							}, function () {
								resolve(STATUS("SC200", "success", featuredList));
							})
						} else {
							resolve(STATUS("SC202", "No data founds", featuredList));
						}
					})
				}
			})
			return promise;
		}
		// get store Names
	this.getStoreNames = (params, callback) => {
		console.log("--->params", params);
		var storesList = [];
		async.auto({

			"get_store_names": (cb) => {

				var query = {
					
				};
				if(params.city){
					query.city= params.city
				}
				var path = 'storeId';
				var select = 'accountInfo'
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

				if (params["categoryName"]) {
					populate["match"]["accountInfo.category"] = params["categoryName"];
				}
				var projection = {
					"city": 1,
					"storeId": 1
				}

				branchModel.find(query).select(projection).populate(populate).setOptions({
					lean: true
				}).exec((err, dbResult) => {
					console.log("-----> dbResult", JSON.stringify(dbResult));
					if (!err) {

						for (var i = 0; i < dbResult.length; i++) {

							if (dbResult[i]["storeId"]) {
								storesList.push({
									storeName: dbResult[i]["storeId"]["accountInfo"]["storeName"],
									storeLogo: serverConstants.url.BASEURl + "/uploads/" + dbResult[i]["storeId"]["accountInfo"]["storeLogo"],
									storeThumbnail: serverConstants.url.BASEURl + "/uploads/" + dbResult[i]["storeId"]["accountInfo"]["storeThumbnail"],
									storeWebsite:dbResult[i]["storeId"]["accountInfo"]["website"],
									storeId:dbResult[i]["storeId"]["_id"],
									categoryName:params["categoryName"]
								})
							}

						}
						cb(null,STATUS("SC200", "success", storesList));
					} else {
						cb(err);
					}

				})


			}
		},(err,data)=>{
			if(!err){
				callback(null,data.get_store_names)
			}else{
				callback(err);
			}
		})


	}
	return this;
}());

module.exports = commonCntrl;