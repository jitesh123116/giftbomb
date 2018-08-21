/*
 * @Author: Sachin kumar
 * @Date:   09/june/2017
 */

var Promise = require('bluebird');
var storeModel = require('./storeModel');
var userModel = require('../users/userModel');
var branchModel = require('./branchModel');
var promotionModel = require('../promotion/promotionModel');
var searchModel = require('./searchModel');
var STATUS = require('../statusCode');
var serverConstants = require('../serverConstants');
var async = require('async');
var md5 = require('md5');
var multer = require('multer');
var upload = multer({
	dest: 'uploads/'
})
var mail = require('../mail');
var fs = require('fs');
var path = require('path');

var serverConstants = require('../serverConstants');
var categories = serverConstants["categories"];




var storeCntrl = (function () {


	/**
	 * @Method:createStore is used to insert the store data
	 * @param {type} store
	 * @returns {storeCntrl_L16.createStore.promise}
	 */
	this.createStore = function (store) {
		console.log("====> create store");
		var that = store.body;
		var fileData = store;
		var filename = '';
		var promise = new Promise(function (resolve, reject) {
			console.log("2");
			if (!store.files) {
				console.log("3");
				resolve(STATUS("SC200", "Store image is required"));
			} else {
				console.log("4");
				console.log("----> fileData", fileData);
				console.log("---> filename", fileData.files);
				filename = fileData.files.storeImage[0].filename;
				storeModel.find({
					"accountInfo.storeName": that.storeName
				}, function (err, data) {
					console.log("---?strr model", err, data);
					if (err) {
						resolve(STATUS("SC202", err));
					} else if (data.length > 0) {
						resolve(STATUS("SC202", "This storeName is already exist"));
					} else {
						storeModel.find({
							"contactInfo.email": that.email
						}, function (err, data) {

							console.log("----> err", err, data);
							if (err) {
								resolve(STATUS("SC202", err));
							} else if (data.length > 0) {
								resolve(STATUS("SC202", "This email address is already exist"));
							} else {

								if (!that.storeName) {
									reject({
										"error": "Store Name missing"
									});
								} else if (!that.category) {
									reject({
										"error": "Store category missing"
									});
								} else if (!that.country) {
									reject({
										"error": "Store country missing"
									});
								} else if (!that.firstName) {
									reject({
										"error": "First name missing"
									});
								} else if (!that.lastName) {
									reject({
										"error": "Last name missing"
									});
								} else if (!that.contactNumber) {
									reject({
										"error": "contactNumber missing"
									});
								} else if (!that.email) {
									reject({
										"error": "Contact email missing"
									});
								} else if (!that.branchlocationName) {
									reject({
										"error": "Location name missing"
									});
								} else if (!that.branchphoneNumber) {
									reject({
										"error": "phoneNumber missing"
									});
								} else if (!that.branchstate) {
									reject({
										"error": "Location state missing"
									});
								} else if (!that.branchcity) {
									reject({
										"error": "Location city missing"
									});
								} else if (!that.branchpincode) {
									reject({
										"error": "Location pincode missing"
									});
								} else if (!that.branchlat) {
									reject({
										"error": "Location latitude missing"
									});
								} else if (!that.branchlon) {
									reject({
										"error": "Location longitude missing"
									});
								} else if (!that.branchaddress) {
									reject({
										"error": "Location address missing"
									});
								} else {
									var passwordCode = getRandomIntInclusive(10000, 99999);
									var newStore = new storeModel();
									newStore.accountInfo = {};
									newStore.accountInfo.storeName = that.storeName;
									newStore.accountInfo.storeThumbnail = filename;
									newStore.accountInfo.storeLogo = fileData.files.storeLogo[0].filename;
									newStore.accountInfo.category = that.category;
									newStore.accountInfo.website = (that.website !== undefined) ? that.website : '';
									newStore.accountInfo.tagLine = (that.tagLine !== undefined) ? that.tagLine : '';
									//newStore.accountInfo.state = that.state;
									newStore.accountInfo.country = that.country;
									newStore.bankAccountInfo = {};
									newStore.contactInfo = {};
									newStore.contactInfo.firstName = that.firstName;
									newStore.contactInfo.lastName = that.lastName;
									newStore.contactInfo.contactNumber = that.contactNumber;
									newStore.contactInfo.email = that.email;
									newStore.contactInfo.password = '';
									newStore.passwordCode = passwordCode;

									newStore.save(function (err, storeResult) {
										console.log("====> new store", err, storeResult);

										if (err) {
											reject(err);
										} else {
											var ObjectId = require('mongoose').Types.ObjectId;
											var newBranch = new branchModel();
											newBranch.storeId = storeResult._id;
											newBranch.locationName = that.branchlocationName;
											newBranch.phoneNumber = that.branchphoneNumber;
											newBranch.city = that.branchcity;
											newBranch.pincode = that.branchpincode;
											//newBranch.country = that.branchcountry;
											newBranch.state = that.branchstate;
											newBranch.address = that.branchaddress;
											newBranch.lat = that.branchlat;
											newBranch.lon = that.branchlon;
											newBranch.branchLocation = {
												'type': 'Point',
												'coordinates': [that.branchlon, that.branchlat],
											};
											newBranch.default = true;
											newBranch.save(function (err, branch) {
												console.log("new branch", err, branch);
												if (err) {
													resolve(STATUS("SC202", err));
												} else {
													var result = {};
													result.store = storeResult;
													result.branch = branch;
													var to = that.email;
													var sub = "Generate Password";
													var htmlBody = 'Hi, \n\n' + 'click on below link to generate password and use the same for merchant login.' + '\n\n';
													htmlBody += '<a href="' + serverConstants.url.BASEURl + '/merchant/#/reset/' + storeResult._id + '/' + passwordCode + '">' + serverConstants.url.BASEURl + '/merchant/#/reset/' + storeResult._id + '/' + passwordCode + '</a>' + '\n\n';
													htmlBody += 'Thanks' + '\n\n';
													htmlBody += 'Giftbomb team';
													mail.sendMail(to, sub, htmlBody)
														.then(function (emailSuccess) {
															//resolve(STATUS("SC200","Email sent successfully", emailSuccess));
														}, function (emailFail) {
															//reject(STATUS("SC202","Email sent fail", emailFail));
														})
													resolve(STATUS("SC200", "Store added successfully and an email with Login credentials has been sent to the Merchant's email id.", result));
												}
											})
										}
									})
								}
							}
						})
					}
				})
			}
		})
		return promise;
	}

	this.getRandomIntInclusive = function (min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	this.createBranch = function (branch) {
		var promise = new Promise(function (resolve, reject) {
			branchModel.find({
				"storeId": branch.storeId,
				"locationName": branch.locationName
			}, function (err, data) {
				if (err) {
					reject(err);
				} else if (data.length > 0) {
					reject({
						"error": "Location name already exist with this Store"
					});
				} else if (!branch.storeId) {
					reject({
						"error": "Please select a store."
					});
				} else if (!branch.locationName) {
					reject({
						"error": "Location name a store."
					});
				} else if (!branch.phoneNumber) {
					reject({
						"error": "PhoneNumber missing"
					});
				} else if (!branch.city) {
					reject({
						"error": "City missing"
					});
				} else if (!branch.pincode) {
					reject({
						"error": "Pincode missing"
					});
				} else if (!branch.state) {
					reject({
						"error": "State missing"
					});
				} else if (!branch.address) {
					reject({
						"error": "Address missing"
					});
				} else if (!branch.lat) {
					reject({
						"error": "latitude missing"
					});
				} else if (!branch.lon) {
					reject({
						"error": "longitude missing"
					});
				} else {
					var newBranch = new branchModel();
					newBranch.storeId = branch.storeId;
					newBranch.phoneNumber = branch.phoneNumber;
					newBranch.locationName = branch.locationName;
					newBranch.city = branch.city;
					newBranch.pincode = branch.pincode;
					//newBranch.country = branch.country;
					newBranch.state = branch.state;
					newBranch.address = branch.address;
					newBranch.lat = branch.lat;
					newBranch.lon = branch.lon;
					newBranch.default = false;
					//console.log("newBranch");
					// console.log(newBranch);

					newBranch.branchLocation = {
						'type': 'Point',
						'coordinates': [branch.lon, branch.lat],
					};


					newBranch.save(function (err, branch) {
						if (err) {
							resolve(STATUS("SC202", err));
						} else {
							resolve(STATUS("SC200", "New Branch added successfully"));
						}
					})
				}
			})
		})
		return promise;
	}

	/**
	 * 
	 * @param {type} params
	 * @returns {storeCntrl_L17.getAllStores.promise}
	 */
	this.getAllStores = function (req) {

		queryData = JSON.parse(req.query.query);
		var limit = (queryData.limit !== undefined) ? parseInt(queryData.limit) : 10;
		var skip = (queryData.page !== undefined) ? (limit * (queryData.page - 1)) : 0;
		var params = req.params;
		var promise = new Promise(function (resolve, reject) {
			var query = {};
			if (params.cat !== undefined && params.cat !== null && params.cat !== 'null' && params.cat) {
				query["accountInfo.category"] = params.cat;
			}
			if (queryData.search !== undefined && queryData.search) {
				query["accountInfo.storeName"] = {
					$regex: new RegExp("^" + queryData.search, "i")
				};
			}

			//console.log("query",query);
			//console.log("params",params);

			storeModel.find(query).sort({
				"_id": -1
			}).limit(limit).skip(skip).exec(function (err, allStores) {
				if (err) {
					resolve(STATUS("SC200", err));
				} else {
					async.eachSeries(allStores, function (item, cb) {
						branchModel.find({
							"storeId": item._id
						}, function (err, branches) {
							if (err) {
								reject(err);
								cb();
							} else {
								item.branch = branches;
								cb();
							}
						})
					}, function () {
						storeModel.count(query, function (err, c) {
							var Result = {
								rows: allStores,
								totalRows: c
							}
							resolve(STATUS("SC200", "Success", Result));
						});
					})

				}
			})
		})
		return promise;
	}



	
		
	this.getStoreWithAllBranchesforadmin = function (params) {
		var promise = new Promise(function (resolve, reject) {
			storeModel.find({
				"_id": params.sid
			}, {}, {
				lean: true
			}, function (err, data) {
				if (err) {
					reject(err);
				} else if (data.length > 0) {

					var query = {
						"storeId": data[0]._id
					}
					


					console.log(JSON.stringify(query));
					branchModel.find(query, function (err, branches) {

						console.log(err, branches, "----> all data of branches");
						if (err) {
							reject(err);
						} else {
							data[0].accountInfo.storeThumbnail = serverConstants.url.BASEURl + "/uploads/" + data[0].accountInfo.storeThumbnail;

							data[0].accountInfo.storeLogo = serverConstants.url.BASEURl + "/uploads/" + data[0].accountInfo.storeLogo;

							if (branches.length > 0) {
								data[0].branch = branches;
							}
							var d = new Date(new Date().setDate(new Date().getDate() + 0));
							// var d= new Date();
							var month = d.getMonth() + 1;
							// var day = d.getDate() + day;
							var day = d.getDate();
							var date = d.getFullYear() + "-" + month + "-" + day + " 00:00:00.000Z";
							var query={
								storeId: data[0]._id,
								startDate: {
									$lte: new Date(date)
								},
								endDate:{
									$gte:new Date(date)
								}
							}
              console.log("---> query",query )
							promotionModel.find(query, {}, {}, (err, promotionData) => {
								if (!err) {

									data[0]["promotions"] = [];
									if (promotionData.length > 0) {
										for (var i = 0; i < promotionData.length; i++) {

											promotionData[i]["promotionLogo"] = serverConstants.url.BASEURl + "/uploads/" + promotionData[i]["promotionLogo"];

											data[0]["promotions"].push(promotionData[i]);
										}
									}
									resolve(STATUS("SC200", "Get store by id with all branches", data[0]));


								} else {

									reject(err);
								}
							})




						}
					})
				} else {
					reject({
						"error": "No store found with this id " + data[0]._id
					});
				}
			})
		})
		return promise;
	}
	
	
	
	this.getStoreWithAllBranches = function (params) {
		var promise = new Promise(function (resolve, reject) {
			storeModel.find({
				"_id": params.sid
			}, {}, {
				lean: true
			}, function (err, data) {
				if (err) {
					reject(err);
				} else if (data.length > 0) {

					var query = {
						"storeId": data[0]._id
					}
					if (params["long"] && params["lat"]) {
						query["branchLocation"] = {
							$nearSphere: {
								$geometry: {
									type: "Point",
									coordinates: [params.long, params.lat]
								}
							}

						}
					} else {

					}



					//					therapistQuery.therapistLocation = {
					//                $nearSphere: {
					//                    $geometry: {
					//                        type: "Point",
					//                        coordinates: [addressDetails.customerLocation.coordinates[0], addressDetails.customerLocation.coordinates[1]]
					//                    }
					//                    , $maxDistance: (75 * 1000) //convert miles to meters
					//                }
					//            }

					console.log(JSON.stringify(query));
					branchModel.find(query, function (err, branches) {

						console.log(err, branches, "----> all data of branches");
						if (err) {
							reject(err);
						} else {
							data[0].accountInfo.storeThumbnail = serverConstants.url.BASEURl + "/uploads/" + data[0].accountInfo.storeThumbnail;

							data[0].accountInfo.storeLogo = serverConstants.url.BASEURl + "/uploads/" + data[0].accountInfo.storeLogo;

							if (branches.length > 0) {
								data[0].branch = branches[0];
							}
							var d = new Date(new Date().setDate(new Date().getDate() + 0));
							// var d= new Date();
							var month = d.getMonth() + 1;
							// var day = d.getDate() + day;
							var day = d.getDate();
							var date = d.getFullYear() + "-" + month + "-" + day + " 00:00:00.000Z";
							var query={
								storeId: data[0]._id,
								startDate: {
									$lte: new Date(date)
								},
								endDate:{
									$gte:new Date(date)
								}
							}
              console.log("---> query",query )
							promotionModel.find(query, {}, {}, (err, promotionData) => {
								if (!err) {

									data[0]["promotions"] = [];
									if (promotionData.length > 0) {
										for (var i = 0; i < promotionData.length; i++) {

											promotionData[i]["promotionLogo"] = serverConstants.url.BASEURl + "/uploads/" + promotionData[i]["promotionLogo"];

											data[0]["promotions"].push(promotionData[i]);
										}
									}
									resolve(STATUS("SC200", "Get store by id with all branches", data[0]));


								} else {

									reject(err);
								}
							})




						}
					})
				} else {
					reject({
						"error": "No store found with this id " + data[0]._id
					});
				}
			})
		})
		return promise;
	}
	this.updateBranch = function (req) {
		var promise = new Promise(function (resolve, reject) {
			branchModel.find({
				"branchId": req.params.bid
			}, function (err, branch) {
				if (err) {
					reject(err);
				} else if (branch.length > 0) {
					var newBranch = {};
					newBranch.storeId = req.body.storeId ? req.body.storeId : branch[0].storeId;
					newBranch.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : branch[0].phoneNumber;
					newBranch.city = req.body.city ? req.body.city : branch[0].city;
					newBranch.pincode = req.body.pincode ? req.body.pincode : branch[0].pincode;
					newBranch.country = req.body.country ? req.body.country : branch[0].country;
					newBranch.state = req.body.state ? req.body.state : branch[0].state;
					newBranch.address = req.body.address ? req.body.address : branch[0].address;
					newBranch.lat = req.body.lat ? req.body.lat : branch[0].lat;
					newBranch.lon = req.body.lon ? req.body.lon : branch[0].lon;
					newBranch.default = branch[0].default;
					newBranch.status = req.body.status;
				} else {
					reject({
						"error": ""
					});
				}
			})
		})
	}
	this.updateStore = function (req) {
		var promise = new Promise(function (resolve, reject) {
			storeModel.find({
				"storeId": req.params.sid
			}, function (err, store) {
				if (err) {
					reject(err);
				} else if (store.length > 0) {
					var newStore = {};
					newStore.storeId = store[0].storeId;
					newStore.contactInfo = {};
					newStore.contactInfo.contactPerson = store.contact.contactPerson;
					newStore.contactInfo.contactNumber = store.contact.contactNumber;
					newStore.contactInfo.email = store.contact.email;
					newStore.bankAccountInfo = {};
					newStore.bankAccountInfo.accountNumber = store.bank.accountNumber;
					newStore.bankAccountInfo.bankName = store.bank.bankName;
					newStore.bankAccountInfo.routingNumber = store.bank.routingNumber;
					newStore.bankAccountInfo.bankAddress = store.bank.bankAddress;
					newStore.bankAccountInfo.nameOfTheAccount = store.bank.nameOfTheAccount;
					newStore.accountInfo = {};
					newStore.accountInfo.storeName = store.storeName;
					newStore.accountInfo.category = store.category;
					newStore.accountInfo.website = store.website;
					newStore.accountInfo.tagLine = store.tagLine;
					newStore.accountInfo.state = store.state;
					newStore.accountInfo.country = store.country;
					newStore.accountInfo.storeThumbnail = store.storeThumbnail;
				} else {
					reject({
						"error": ""
					});
				}
			})
		})
		return promise;
	}
	this.getBranch = function (params) {
		var promise = new Promise(function (resolve, reject) {
			var query = {};
			var ObjectId = require('mongoose').Types.ObjectId;
			if (params && params.cat) {
				if (params.cat == "all") {
					query = {};
				} else {
					query["accountInfo.category"] = params.cat;
				}
				storeModel.find(query, {
					"_id": 1
				}, function (err, storeIds) {
					if (err) {
						reject(STATUS("SC202", "", err));
					} else if (storeIds.length > 0) {
						var idArray = [];
						storeIds.forEach(function (item) {
							idArray.push(item._id);
						})
						var obj = {};
						obj.storeId = {
							$in: idArray
						};
						if (params.city) {
							obj.city = params.city;
						}
						branchModel.find(obj).populate('storeId').exec(function (err, data) {
							if (err) {
								reject(STATUS("SC202", "", err));
							} else {
								resolve(STATUS("SC200", "All branches category wise", data));
							}
						})
					} else {
						resolve(STATUS("SC200", "No branches for selected category"));
					}
				})
			} else {
				branchModel.find(query).populate('storeId').exec(function (err, branch) {
					if (err) {
						reject(STATUS("SC202", "", err));
					} else {
						resolve(STATUS("SC200", "get all branches", branch));
					}
				})
			}
		})
		return promise;
	}


	this.getAllCategories = function (city) {
		var promise = new Promise(function (resolve, reject) {
			storeModel.distinct("accountInfo.category").exec(function (err, data) {
				if (err) {
					reject(STATUS("SC202", "", err));
				} else {
					resolve(STATUS("SC200", "All store categories", data));
				}
			})
		})
		return promise;
	}
	this.getAllStoreCity = function () {
		var promise = new Promise(function (resolve, reject) {
			branchModel.distinct("city").exec(function (err, data) {
				if (err) {
					reject(STATUS("SC202", "", err));
				} else {
					resolve(STATUS("SC200", "All store city", data));
				}
			})
		})
		return promise;
	}
	this.singleBranchForStore = function (params, query) {
		var promise = new Promise(function (resolve, reject) {
			var query = {
				"storeId": params.sid,
				"city": params.branchCity
			};
			if (query && query.query) {
				query = JSON.parse(query.query);
			}
			if (query && query.redeemed) {
				// TO DO
			} else {
				branchModel.find(query, function (err, data) {
					if (err) {
						reject(err);
					} else {
						resolve(STATUS("SC200", "Branch for " + params.branchCity, data));
					}
				})
			}
		})
		return promise;
	}
	this.changeBranchStatus = function (params) {
		var promise = new Promise(function (resolve, reject) {
			branchModel.find({
				"branchId": params.bid
			}, function (err, data) {
				if (err) {
					reject(err);
				} else {
					data[0].status ? status = false : status = true;
					branchModel.update({
						"branchId": params.bid
					}, {
						$set: {
							"status": status
						}
					}, function (err, data) {
						if (err) {
							reject(err);
						} else {
							resolve(STATUS("SC200", "Branch Status has been changed"));
						}
					})
				}
			})
		})
		return promise;
	}
	this.searchStore = function (query) {
		console.log(query, "---> search query");
		var searchQuery = JSON.parse(query.query.query);
		var storeNameExactFlag = (searchQuery.storeNameExactFlag !== undefined) ? 1 : 0;
		var promise = new Promise(function (resolve, reject) {
			var query = {};
			if (searchQuery.storeName && storeNameExactFlag == 1) {
				query = {
					"accountInfo.storeName": searchQuery.storeName
				};
			}
			if (searchQuery.storeName) {
				query = {
					"accountInfo.storeName": {
						$regex: new RegExp("^" + searchQuery.storeName, "i")
					}
				};
			}

			console.log("---> final query print", query);
			storeModel.find(query, function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (data.length > 0) {
					resolve(STATUS("SC200", "Success", data));
				} else {
					resolve(STATUS("SC202", "no data founds"));
				}
			})
		})
		return promise;
	}
	this.updateLikes = function (uid, sid) {
		var promise = new Promise(function (resolve, reject) {
			storeModel.find({
				"_id": sid
			}, function (err, store) {
				if (err) {
					reject(err);
				} else if (store.length > 0) {
					var result = {};
					if (store[0].likes.indexOf(uid) > -1) {
						storeModel.findOneAndUpdate({
							"_id": sid
						}, {
							$pull: {
								"likes": uid
							}
						}, {
							new: true
						}, function (err, data) {
							if (err) {
								reject(err);
							} else {
								userModel.findOneAndUpdate({
									"_id": uid
								}, {
									$pull: {
										"favourite": sid
									}
								}, {
									new: true
								}, function (err, userUpdate) {
									if (err) {
										reject(err)
									} else {
										result.likes = data.likes.length;
										resolve(STATUS("SC200", "likes removed", result));
									}
								})
							}
						})
					} else {
						storeModel.findOneAndUpdate({
							"_id": sid
						}, {
							$push: {
								"likes": {
									$each:[uid],
								  $position:0
								}
							}
						}, {
							new: true
						}, function (err, data) {
							if (err) {
								reject(err);
							} else {
								userModel.findOneAndUpdate({
									"_id": uid
								}, {
									$push: {
										"favourite": {
									$each:[sid],
								  $position:0
										}
									}
								}, {
									new: true
								}, function (err, userUpdate) {
									if (err) {
										reject(err)
									} else {
										result.likes = data.likes.length;
										resolve(STATUS("SC200", "likes added", result));
									}
								})
							}
						})
					}
				} else {
					reject({
						"error": "No store found, please check storeId"
					});
				}
			})
		})
		return promise;
	}

	this.getBranchWithId = function (id) {
		var promise = new Promise(function (resolve, reject) {
			var ObjectId = require('mongoose').Types.ObjectId;
			if (id) {
				//console.log("_id",id);
				branchModel.find({
					"_id": id
				}, function (err, data) {
					if (err) {
						resolve(STATUS("SC202", err));
					} else {
						resolve(STATUS("SC200", "success", data));
					}
				})
			}
		})
		return promise;
	}


	//fetch store data
	this.fetchStore = function (where) {
		if (where['contactInfo.password'] !== undefined) {
			where['contactInfo.password'] = md5(where['contactInfo.password']);
		}
		var promise = new Promise(function (resolve, reject) {
			storeModel.find(where, function (err, data) {
				if (err) {
					reject(err);
				} else if (data.length > 0) {
					resolve(STATUS("SC200", "Login successful", data));
				} else {
					resolve(STATUS("SC202", "Invalid credentials, please check your email or password or both"));
				}
			})
		})
		return promise;
	}

	//updateData
	this.updateDataFor = function (where, column) {
		///console.log("===updateData column===",column);
		if (column.$set['contactInfo.password'] !== undefined) {
			column.$set['contactInfo.password'] = md5(column.$set['contactInfo.password']);
		}

		//console.log("===updateData where===",column);

		var promise = new Promise(function (resolve, reject) {
			storeModel.update(where, column, function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(STATUS("SC200", "Record updated successfully", data));
				}
			})
		})
		return promise;

	}


	this.editStore = function (store) {
		var that = store.body;
		var fileData = store;
		var filename = '';
		var promise = new Promise(function (resolve, reject) {
			if (fileData.files !== undefined) {
				//				filename = fileData.files.filename;
				filename = fileData.files.storeImage[0].filename;
			}
			storeModel.find({
				"locationName.storeName": that.storeName,
				_id: {
					$ne: that._id
				}
			}, function (err, data) {

				if (err) {
					resolve(STATUS("SC202", err));
				} else if (data.length > 0) {
					//reject({"error":"storeName already exist"});
					resolve(STATUS("SC202", "storeName already exist"));
				} else {
					//
					branchModel.find({
						"locationName": that.branchlocationName,
						_id: {
							$ne: that.branchId
						}
					}, function (err, data) {
						//console.log("err",err);
						//console.log("data",data);

						if (err) {
							resolve(STATUS("SC202", err));
						} else if (data.length > 0) {
							resolve(STATUS("SC202", "Location name with this store already exist"));
						} else {

							if (!that.storeName) {
								reject({
									"error": "Store Name missing"
								});
							} else if (!that.category) {
								reject({
									"error": "Store category missing"
								});
							} else if (!that.country) {
								reject({
									"error": "Store country missing"
								});
							} else if (!that.firstName) {
								reject({
									"error": "First name missing"
								});
							} else if (!that.lastName) {
								reject({
									"error": "Last name missing"
								});
							} else if (!that.contactNumber) {
								reject({
									"error": "contactNumber missing"
								});
							} else if (!that.email) {
								reject({
									"error": "Contact email missing"
								});
							} else if (!that.branchlocationName) {
								reject({
									"error": "Location name missing"
								});
							} else if (!that.branchphoneNumber) {
								reject({
									"error": "phoneNumber missing"
								});
							} else if (!that.branchstate) {
								reject({
									"error": "branchstate missing"
								});
							} else if (!that.branchcity) {
								reject({
									"error": "branch city missing"
								});
							} else if (!that.branchpincode) {
								reject({
									"error": "branch pincode missing"
								});
							} else if (!that.branchlat) {
								reject({
									"error": "branch latitude missing"
								});
							} else if (!that.branchlon) {
								reject({
									"error": "branch longitude missing"
								});
							} else if (!that.branchaddress) {
								reject({
									"error": "branch address missing"
								});
							} else {


								var contactInfo = {
									firstName: that.firstName,
									lastName: that.lastName,
									contactNumber: that.contactNumber,
									email: that.email
								};

								var storeArray = {
									"accountInfo.storeName": that.storeName,
									"accountInfo.category": that.category,
									"accountInfo.website": (that.website !== undefined) ? that.website : '',
									"accountInfo.tagLine": (that.tagLine !== undefined) ? that.tagLine : '',
									//"accountInfo.state" : that.state,
									"accountInfo.country": that.country,
									contactInfo: contactInfo
								}

								//var storeModel = new storeModel();

								if (filename != '') {
									storeArray["accountInfo.storeThumbnail"] = filename;
								}
								//console.log("=====accountInfo======", accountInfo);
								if (fileData.files && fileData.files.storeLogo && fileData.files.storeLogo[0].filename) {
									storeArray["accountInfo.storeLogo"] = fileData.files.storeLogo[0].filename;
								}


								storeModel.update({
									"_id": that._id
								}, {
									$set: storeArray
								}, function (err, storeResult) {
									if (err) {
										reject(err);
									} else {
										var ObjectId = require('mongoose').Types.ObjectId;
										//var branchModel = new branchModel();
										var branchArray = {
											phoneNumber: that.branchphoneNumber,
											locationName: that.branchlocationName,
											city: that.branchcity,
											pincode: that.branchpincode,
											//country : that.branchcountry,
											state: that.branchstate,
											address: that.branchaddress,
											lat: that.branchlat,
											lon: that.branchlon,
											//branchId : that.branchId
										}
										branchModel.update({
											"_id": that.branch_id
										}, {
											$set: branchArray
										}, function (err, branch) {
											//console.log("errrrrrrrrrr",err);
											if (err) {
												resolve(STATUS("SC202", err));
											} else {
												var result = {};
												result.store = storeResult;
												result.branch = branch;
												resolve(STATUS("SC200", "Store updated successfully", result));
											}
										})
									}
								})
							}




						}

					})


				} //store1
			})


		})
		return promise;
	}


	this.resetRequest = function (req) {

		//console.log("==fetchDataForAdmin==",constantUrl);

		var promise = new Promise(function (resolve, reject) {
			storeModel.find({
				"contactInfo.email": req.body.email.toLowerCase()
			}, function (err, data) {
				// console.log("data._id", data);


				if (err) {
					resolve(STATUS("SC202", err));
				} else if (data.length > 0) {
					var passwordCode = getRandomIntInclusive(10000, 99999);
					storeModel.update({
						"_id": data[0]._id
					}, {
						$set: {
							"passwordCode": passwordCode
						}
					}, function (err, upDatedata) {
						//console.log("data._id", data);
						//console.log("length", data.length);
						if (err) {
							resolve(STATUS("SC200", err));
						} else if (data.length > 0) {

							//console.log("contactInfo.email", data[0].contactInfo.email);
							//console.log("data._id", data[0]._id);

							var to = data[0].contactInfo.email;
							var sub = "Reset Password";
							var htmlBody = 'Hi, \n\n' + 'click on below link to reset password and use the same for merchant login.' + '\n\n';
							htmlBody += '<a href="' + serverConstants.url.BASEURl + '/merchant/#/reset/' + data[0]._id + '/' + passwordCode + '">' + serverConstants.url.BASEURl + '/merchant/#/reset/' + data[0]._id + '/' + passwordCode + '</a>' + '\n\n';
							htmlBody += 'Thanks' + '\n\n';
							htmlBody += 'Giftbomb team';
							mail.sendMail(to, sub, htmlBody)
								.then(function (emailSuccess) {
									resolve(STATUS("SC200", "Email sent successfully", emailSuccess));
								}, function (emailFail) {
									resolve(STATUS("SC202", "Email sent fail", emailFail));
								})
						}
					})
				} else {
					resolve(STATUS("SC202", "This email address does not exist."));
				}
			})
		})
		return promise;
	}

	/**
	 * 
	 */
	this.searchStoreApi = function (search) {
		var result = [];
		search = search.replace("%20", " ");
		if (!search) {
			resolve(STATUS("SC202", "Search keyword is required"));
		} else {
			var promise = new Promise(function (resolve, reject) {
				//var columns = {"_id","accountInfo.storeName","accountInfo.storeThumbnail","accountInfo.category"}
				//var query = query["accountInfo.storeName"] = { $regex: new RegExp(".*" + search, "i") };

				storeModel.find({
					"accountInfo.storeName": {
						$regex: new RegExp("^" + search, "i")
					}
				}, function (err, data) {
					if (err) {
						resolve(STATUS("SC202", err));
					} else if (data.length > 0) {

						for (var i = 0; i < data.length; i++) {


							var row = {
								_id: data[i]._id,
								storeName: (data[i].accountInfo.storeName) ? data[i].accountInfo.storeName : '',
								storeThumbnail: (data[i].accountInfo.storeThumbnail) ? serverConstants.url.BASEURl + "/uploads/" + data[i].accountInfo.storeThumbnail : '',
								storeLogo: (data[i].accountInfo.storeLogo) ? serverConstants.url.BASEURl + "/uploads/" + data[i].accountInfo.storeLogo : '',
								category: (data[i].accountInfo.category) ? data[i].accountInfo.category : ''
							}

							console.log("---> search store pai", row);
							result.push(row);
						}
						resolve(STATUS("SC200", "Success", result));
					} else {
						resolve(STATUS("SC202", "Stores not found"));
					}
				})
			})
		}
		return promise;
	}

	//to increase count of string
	this.saveSearchString = (requestBody) => {
		var searchData = requestBody.searchData.toLowerCase();
		var promise = new Promise((resolve, reject) => {
			searchModel.findOne({
				"searchString": searchData
			}, (err, data) => {
				if (err) {
					reject(STATUS("SC202", err));
				} else if (data == null) {
					var newSearchString = new searchModel({
						"searchString": searchData,
						"searchCount": 1
					});
					newSearchString.save((err, document) => {
						if (err) {
							reject(STATUS("SC202", err));
						} else {
							resolve(STATUS("SC2OO", "Success", document));
						}
					})
				} else {
					searchModel.updateOne({
						"searchString": searchData
					}, {
						"searchCount": data.searchCount + 1
					}, (err, document) => {
						if (err) {
							reject(STATUS("SC202", err));
						} else {
							resolve(STATUS("SC200", "Success", document));
						}
					})
				}
			})
		})
		return promise;
	}

	/**
	 *@createExcelFile is used to create excel file 
	 */
	this.createExcelFile = function (params) {

		var query = {};
		if (params.category !== undefined && params.category !== null && params.category !== 'null' && params.category) {
			query["accountInfo.category"] = params.category;
		}
		if (params.searchText !== undefined && params.searchText) {
			query["accountInfo.storeName"] = {
				$regex: new RegExp("^" + params.searchText, "i")
			};
		}

		var promise = new Promise(function (resolve, reject) {
			storeModel.find(query, function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (data.length > 0) {

					async.eachSeries(data, function (item, cb) {
						branchModel.find({
							"storeId": item._id
						}, function (err, branches) {
							if (err) {
								cb();
							} else {
								item.branch = branches;
								cb();
							}
						})
					}, function () {
						var str = "Sl. No." + "," + "STORE ID" + "," + "NAME" + "," + "CATEGORY" + "," + "NO. OF LOCATION" + "\n";
						for (var i = 0; i < data.length; i++) {
							var storeId = (data[i].storeId !== undefined) ? data[i].storeId : '';
							var storeName = (data[i].accountInfo.storeName !== undefined) ? data[i].accountInfo.storeName : '';
							var category = (data[i].accountInfo.category !== undefined) ? data[i].accountInfo.category : '';
							var branch = (data[i].branch !== undefined) ? data[i].branch.length : '';
							str += (i + 1) + "," + storeId + "," + storeName + "," + category + "," + branch + "\n";
						}
						var output = path.resolve('/home/giftbomb/giftbomb_mean/uploads/' + "storeFile.xls"); //dev
						//var output= path.resolve('/var/www/html/giftbomb_mean/uploads/'+ "storeFile.xls"); //local
						fs.writeFile(output, str, function (err) {
							if (err) {
								resolve(STATUS("SC202", err));
							} else {
								resolve(STATUS("SC200", "Success", data));
							}
						});
					})
				} else {
					resolve(STATUS("SC202", "No data founds"));
				}
			})
		})
		return promise;
	}

	/**
	 * 
	 */
	this.fetchBranchData = function (params, query) {
		var promise = new Promise(function (resolve, reject) {
			var query = {
				"storeId": params.sid,
				"locationName": params.locationName
			};
			branchModel.find(query, function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else {
					resolve(STATUS("SC200", "Success", data));
				}
			})
		})
		return promise;
	}


	/**
	 * 
	 */
	this.getCategoriesCityBasis = function (city) {
		var promise = new Promise(function (resolve, reject) {
			var query = {};
			var ObjectId = require('mongoose').Types.ObjectId;
			if (city) {
				query["city"] = city;
				branchModel.find(query, {
					"storeId": 1
				}, function (err, branchData) {
					//console.log("branchDatabranchDatabranchData",branchData);
					if (err) {
						resolve(STATUS("SC202", err));
					} else if (branchData.length > 0) {
						var idArray = [];
						branchData.forEach(function (item) {
							idArray.push(item.storeId);
						})

						// console.log("idArray",idArray);
						storeModel.distinct("accountInfo.category", {
							_id: {
								$in: idArray
							}
						}, function (err, data) {
							if (err) {
								resolve(STATUS("SC202", err));
							} else {
								resolve(STATUS("SC200", "All branches category wise", data));
							}
						})
					} else {
						resolve(STATUS("SC202", "No branches for selected category"));
					}
				})
			} else {
				storeModel.distinct("accountInfo.category", function (err, data) {
					if (err) {
						resolve(STATUS("SC202", err));
					} else {
						resolve(STATUS("SC200", "Success", data));
					}
				})
			}
		})
		return promise;
	}



	/**
	 * 
	 */
	this.getBranchWithLimit = function (req) {


		var limit = (req.limit !== undefined) ? parseInt(req.limit) : 10;
		var skip = (req.page !== undefined) ? (limit * (req.page - 1)) : 0;
		var query = {};
		var promise = new Promise(function (resolve, reject) {
			var ObjectId = require('mongoose').Types.ObjectId;
			if (req.category !== undefined && req.category !== null && req.category !== 'all' && req.category !== 'null' && req.category) {
				query["accountInfo.category"] = req.category;

				storeModel.find(query, {
					"_id": 1
				}, function (err, storeIds) {
					if (err) {
						reject(STATUS("SC202", "", err));
					} else if (storeIds.length > 0) {
						var idArray = [];
						storeIds.forEach(function (item) {
							idArray.push(item._id);
						})
						var obj = {};
						obj.storeId = {
							$in: idArray
						};
						if (req.city !== undefined && req.city !== null && req.city !== 'null' && req.city) {
							obj.city = req.city;
						}
						branchModel.find(obj).limit(limit).skip(skip).populate('storeId').exec(function (err, data) {
							if (err) {
								resolve(STATUS("SC202", err));
							} else {
								branchModel.count(obj, function (err, c) {
									var Result = {
										rows: data,
										totalRows: c
									}
									resolve(STATUS("SC200", "Success", Result));
								});
							}
						})
					} else {
						resolve(STATUS("SC202", "No branches for selected category"));
					}
				})
			} else {
				if (req.city !== undefined && req.city !== null && req.city !== 'null' && req.city) {
					query["city"] = req.city;
				}
				branchModel.find(query).limit(limit).skip(skip).populate('storeId').exec(function (err, branch) {
					if (err) {
						resolve(STATUS("SC202", err));
					} else {
						branchModel.count(query, function (err, c) {
							var Result = {
								rows: branch,
								totalRows: c
							}
							resolve(STATUS("SC200", "Success", Result));
						});
					}
				})
			}
		})
		return promise;
	}

	/**
	 *@updateBranchData 
	 */
	this.updateBranchData = function (where, column) {

		var promise = new Promise(function (resolve, reject) {
			branchModel.update(where, column, function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(STATUS("SC200", "Record updated successfully", data));
				}
			})
		})
		return promise;
	}



	this.fetchSearchRecord = (req) => {
		var count;
		var doc = {};



		var req = JSON.parse(req.query.query);
		var limit = parseInt(req.limit);
		var skip = (limit * (req.page - 1));
		var promise = new Promise((resolve, reject) => {
			var query = {};
			searchModel.find({}, (err, info) => {
				if (err) {
					resolve(STATUS("SC202", err));
				}
				count = info.length;
				doc.count = count;
				searchModel.find(query).sort({
					"_id": -1
				}).limit(limit).skip(skip).exec((err, data) => {
					if (err) {
						resolve(STATUS("SC202", err));
					} else {
						doc.data = data;
						doc.count = count;
						resolve(STATUS("SC200", "success", doc));
					}
				})
			})



		})
		return promise;
	}



	this.resetRequest = function (req) {

		//console.log("==fetchDataForAdmin==",constantUrl);

		var promise = new Promise(function (resolve, reject) {
			storeModel.find({
				"contactInfo.email": req.body.email.toLowerCase()
			}, function (err, data) {
				// console.log("data._id", data);


				if (err) {
					resolve(STATUS("SC202", err));
				} else if (data.length > 0) {
					var passwordCode = getRandomIntInclusive(10000, 99999);
					storeModel.update({
						"_id": data[0]._id
					}, {
						$set: {
							"passwordCode": passwordCode
						}
					}, function (err, upDatedata) {
						//console.log("data._id", data);
						//console.log("length", data.length);
						if (err) {
							resolve(STATUS("SC200", err));
						} else if (data.length > 0) {

							//console.log("contactInfo.email", data[0].contactInfo.email);
							//console.log("data._id", data[0]._id);

							var to = data[0].contactInfo.email;
							var sub = "Reset Password";
							var htmlBody = 'Hi, \n\n' + 'click on below link to reset password and use the same for merchant login.' + '\n\n';
							htmlBody += '<a href="' + serverConstants.url.BASEURl + '/merchant/#/reset/' + data[0]._id + '/' + passwordCode + '">' + serverConstants.url.BASEURl + '/merchant/#/reset/' + data[0]._id + '/' + passwordCode + '</a>' + '\n\n';
							htmlBody += 'Thanks' + '\n\n';
							htmlBody += 'Giftbomb team';
							mail.sendMail(to, sub, htmlBody)
								.then(function (emailSuccess) {
									resolve(STATUS("SC200", "Email sent successfully", emailSuccess));
								}, function (emailFail) {
									resolve(STATUS("SC202", "Email sent fail", emailFail));
								})
						}
					})
				} else {
					resolve(STATUS("SC202", "This email address does not exist."));
				}
			})
		})
		return promise;
	}

	/**
	 * 
	 */
	this.searchStoreApi = function (search) {
		var result = [];
		search = search.replace("%20", " ");
		if (!search) {
			resolve(STATUS("SC202", "Search keyword is required"));
		} else {
			var promise = new Promise(function (resolve, reject) {
				//var columns = {"_id","accountInfo.storeName","accountInfo.storeThumbnail","accountInfo.category"}
				//var query = query["accountInfo.storeName"] = { $regex: new RegExp(".*" + search, "i") };
				console.log(search, "----> search");
				storeModel.find({
					"accountInfo.storeName": {
						$regex: new RegExp("^" + search, "i")
					}
				}, function (err, data) {
					console.log(err,data, "---> search result");
					if (err) {
						resolve(STATUS("SC202", err));
					} else if (data.length > 0) {

						for (var i = 0; i < data.length; i++) {
							var row = {
								_id: data[i]._id,
								storeName: (data[i].accountInfo.storeName) ? data[i].accountInfo.storeName : '',
								storeLogo: (data[i].accountInfo.storeLogo) ? serverConstants.url.BASEURl + "/uploads/" + data[i].accountInfo.storeLogo : '',
								storeThumbnail: (data[i].accountInfo.storeThumbnail) ? serverConstants.url.BASEURl + "/uploads/" + data[i].accountInfo.storeThumbnail : '',
								category: (data[i].accountInfo.category) ? data[i].accountInfo.category : ''
							}

							for (var j = 0; j < categories.length; j++) {
								if (row.category == categories[j]["plural"]) {
									row.category = categories[j]["singular"];
									row.pluralCategory = categories[j]["plural"];
								} else {
									continue;
								}
							}
							result.push(row);
						}
						resolve(STATUS("SC200", "Success", result));
					} else {
						resolve(STATUS("SC202", "Stores not found"));
					}
				})
			})
		}
		return promise;
	}

	//to increase count of string
	this.saveSearchString = (requestBody) => {
		var searchData = requestBody.searchData.toLowerCase();
		var promise = new Promise((resolve, reject) => {
			searchModel.findOne({
				"searchString": searchData
			}, (err, data) => {
				if (err) {
					reject(STATUS("SC202", err));
				} else if (data == null) {
					var newSearchString = new searchModel({
						"searchString": searchData,
						"searchCount": 1
					});
					newSearchString.save((err, document) => {
						if (err) {
							reject(STATUS("SC202", err));
						} else {
							resolve(STATUS("SC2OO", "Success", document));
						}
					})
				} else {
					searchModel.updateOne({
						"searchString": searchData
					}, {
						"searchCount": data.searchCount + 1
					}, (err, document) => {
						if (err) {
							reject(STATUS("SC202", err));
						} else {
							resolve(STATUS("SC200", "Success", document));
						}
					})
				}
			})
		})
		return promise;
	}

	/**
	 *@createExcelFile is used to create excel file 
	 */
	this.createExcelFile = function (params) {

		var query = {};
		if (params.category !== undefined && params.category !== null && params.category !== 'null' && params.category) {
			query["accountInfo.category"] = params.category;
		}
		if (params.searchText !== undefined && params.searchText) {
			query["accountInfo.storeName"] = {
				$regex: new RegExp("^" + params.searchText, "i")
			};
		}

		var promise = new Promise(function (resolve, reject) {
			storeModel.find(query, function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (data.length > 0) {

					async.eachSeries(data, function (item, cb) {
						branchModel.find({
							"storeId": item._id
						}, function (err, branches) {
							if (err) {
								cb();
							} else {
								item.branch = branches;
								cb();
							}
						})
					}, function () {
						var str = "Sl. No." + "," + "STORE ID" + "," + "NAME" + "," + "CATEGORY" + "," + "NO. OF LOCATION" + "\n";
						for (var i = 0; i < data.length; i++) {
							var storeId = (data[i].storeId !== undefined) ? data[i].storeId : '';
							var storeName = (data[i].accountInfo.storeName !== undefined) ? data[i].accountInfo.storeName : '';
							var category = (data[i].accountInfo.category !== undefined) ? data[i].accountInfo.category : '';
							var branch = (data[i].branch !== undefined) ? data[i].branch.length : '';
							str += (i + 1) + "," + storeId + "," + storeName + "," + category + "," + branch + "\n";
						}
						var output = path.resolve('/home/giftbomb/giftbomb_mean/uploads/' + "storeFile.xls"); //dev
						//var output= path.resolve('/var/www/html/giftbomb_mean/uploads/'+ "storeFile.xls"); //local
						fs.writeFile(output, str, function (err) {
							if (err) {
								resolve(STATUS("SC202", err));
							} else {
								resolve(STATUS("SC200", "Success", data));
							}
						});
					})
				} else {
					resolve(STATUS("SC202", "No data founds"));
				}
			})
		})
		return promise;
	}

	/**
	 * 
	 */
	this.fetchBranchData = function (params, query) {
		var promise = new Promise(function (resolve, reject) {
			var query = {
				"storeId": params.sid,
				"locationName": params.locationName
			};
			branchModel.find(query, function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else {
					resolve(STATUS("SC200", "Success", data));
				}
			})
		})
		return promise;
	}


	/**
	 * 
	 */
	this.getCategoriesCityBasis = function (city) {
		var promise = new Promise(function (resolve, reject) {
			var query = {};
			var ObjectId = require('mongoose').Types.ObjectId;
			if (city) {
				query["city"] = city;
				branchModel.find(query, {
					"storeId": 1
				}, function (err, branchData) {
					//console.log("branchDatabranchDatabranchData",branchData);
					if (err) {
						resolve(STATUS("SC202", err));
					} else if (branchData.length > 0) {
						var idArray = [];
						branchData.forEach(function (item) {
							idArray.push(item.storeId);
						})

						// console.log("idArray",idArray);
						storeModel.distinct("accountInfo.category", {
							_id: {
								$in: idArray
							}
						}, function (err, data) {
							if (err) {
								resolve(STATUS("SC202", err));
							} else {
								resolve(STATUS("SC200", "All branches category wise", data));
							}
						})
					} else {
						resolve(STATUS("SC202", "No branches for selected category"));
					}
				})
			} else {
				storeModel.distinct("accountInfo.category", function (err, data) {
					if (err) {
						resolve(STATUS("SC202", err));
					} else {
						resolve(STATUS("SC200", "Success", data));
					}
				})
			}
		})
		return promise;
	}



	/**
	 * 
	 */
	this.getBranchWithLimit = function (req) {


		var limit = (req.limit !== undefined) ? parseInt(req.limit) : 10;
		var skip = (req.page !== undefined) ? (limit * (req.page - 1)) : 0;
		var query = {};
		var promise = new Promise(function (resolve, reject) {
			var ObjectId = require('mongoose').Types.ObjectId;
			if (req.category !== undefined && req.category !== null && req.category !== 'all' && req.category !== 'null' && req.category) {
				query["accountInfo.category"] = req.category;

				storeModel.find(query, {
					"_id": 1
				}, function (err, storeIds) {
					if (err) {
						reject(STATUS("SC202", "", err));
					} else if (storeIds.length > 0) {
						var idArray = [];
						storeIds.forEach(function (item) {
							idArray.push(item._id);
						})
						var obj = {};
						obj.storeId = {
							$in: idArray
						};
						if (req.city !== undefined && req.city !== null && req.city !== 'null' && req.city) {
							obj.city = req.city;
						}
						branchModel.find(obj).limit(limit).skip(skip).populate('storeId').exec(function (err, data) {
							if (err) {
								resolve(STATUS("SC202", err));
							} else {
								branchModel.count(obj, function (err, c) {
									var Result = {
										rows: data,
										totalRows: c
									}
									resolve(STATUS("SC200", "Success", Result));
								});
							}
						})
					} else {
						resolve(STATUS("SC202", "No branches for selected category"));
					}
				})
			} else {
				if (req.city !== undefined && req.city !== null && req.city !== 'null' && req.city) {
					query["city"] = req.city;
				}
				branchModel.find(query).limit(limit).skip(skip).populate('storeId').exec(function (err, branch) {
					if (err) {
						resolve(STATUS("SC202", err));
					} else {
						branchModel.count(query, function (err, c) {
							var Result = {
								rows: branch,
								totalRows: c
							}
							resolve(STATUS("SC200", "Success", Result));
						});
					}
				})
			}
		})
		return promise;
	}

	/**
	 *@updateBranchData 
	 */
	this.updateBranchData = function (where, column) {

		var promise = new Promise(function (resolve, reject) {
			branchModel.update(where, column, function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(STATUS("SC200", "Record updated successfully", data));
				}
			})
		})
		return promise;
	}



	this.fetchSearchRecord = (req) => {
		var count;
		var doc = {};



		var req = JSON.parse(req.query.query);
		var limit = parseInt(req.limit);
		var skip = (limit * (req.page - 1));
		var promise = new Promise((resolve, reject) => {
			var query = {};
			searchModel.find({}, (err, info) => {
				if (err) {
					resolve(STATUS("SC202", err));
				}
				count = info.length;
				doc.count = count;
				searchModel.find(query).sort({
					"_id": -1
				}).limit(limit).skip(skip).exec((err, data) => {
					if (err) {
						resolve(STATUS("SC202", err));
					} else {
						doc.data = data;
						doc.count = count;
						resolve(STATUS("SC200", "success", doc));
					}
				})
			})


		})
		return promise;
	}

	/**
	 *@Change Password
	 */
	//updateData
	this.changePasswordForStore = function (where, column, oldPassword) {

		if (column.$set['contactInfo.password'] !== undefined) {
			column.$set['contactInfo.password'] = md5(column.$set['contactInfo.password']);
		}

		var query = {
			_id: where._id
		}

		var promise = new Promise(function (resolve, reject) {

			storeModel.find(query, function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (data.length > 0) {
					if (data[0].contactInfo.password == md5(oldPassword)) {

						storeModel.update(where, column, function (err, data) {
							if (err) {
								reject(err);
							} else {
								resolve(STATUS("SC200", "Record updated successfully", data));
							}
						})

					} else {
						resolve(STATUS("SC202", "Old password does not match"));
					}
				}
			})
		})
		return promise;

	}



	return this;
}());

module.exports = storeCntrl;