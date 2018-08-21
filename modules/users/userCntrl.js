/*
 * @Author: Sachin kumar
 * @Date:   08/june/2017
 */

var Promise = require('bluebird');
var userModel = require('./userModel');
var adminModel = require('../admin/adminModel');
var STATUS = require('../statusCode');
var fs = require('fs');
var path = require('path');
var dateFormat = require('dateformat');
var serverConstants = require('../serverConstants');
var categories = serverConstants["categories"];
//Twilio Credentials 
//Email - app@giftbomb.com
//Password - 8Qx-pCK-UgX-U6s
var accountSid = 'AC0d15902b892899f6857b10fd28792ac0';
var authToken = 'c4c5370648082feb6eb18804004787d0';
var TokenManager = require('../utilities/tokenManager');
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken);
var stripe = require("stripe")("sk_test_iRzKKdCdoOF3IuXaHsHjHkbG");
var adminCtrl = (function () {
	this.loginUser = function (user) {
		var promise = new Promise(function (resolve, reject) {
			//generate 6 digit random number
			var otp = Math.floor(Math.random() * 899999 + 100000);
			if (!user.countryCode) {
				reject(STATUS("SC202", "Country Code is missing"));
			} else if (!user.phoneNumber) {
				reject(STATUS("SC202", "Mobile Number is missing"));
			} else if (!user.country) {
				reject(STATUS("SC202", "country is missing"));
			} else if (!user.deviceType) {
				reject(STATUS("SC202", "deviceType is missing"));
			} else if (!user.deviceId) {
				reject(STATUS("SC202", "deviceId is missing"));
			} else if (!user.deviceToken) {
				reject(STATUS("SC202", "deviceToken is missing"));
			} else {
				//var ph = user.countryCode+user.phoneNumber;
				userModel.find({
					"phoneNumber": user.phoneNumber.trim(),
					"countryCode": user.countryCode,
					"accountStatus": serverConstants["account_status"]["ACTIVE"]
				},{},{}, function (err, data) {

					console.log(err, data, "---> details of user");
					if (err) {
						reject(STATUS("SC202", "", err));
					} else if (data.length > 0) {

						if (data[0]["accountStatus"] == serverConstants["account_status"]["ACTIVE"]) {
							userModel.findOneAndUpdate({
								"_id": data[0]._id
							}, {
								$set: {
									"otp": otp,
									"deviceId": user.deviceId,
									"deviceToken": user.deviceToken
								}
							}, {
								new: true
							}, function (err, otpUpdate) {
								if (err) {
									reject(STATUS("SC202", "Error while updating OTP", err));
								} else {
									otpUpdate.newUser = false;
									client.messages.create({
										to: user.countryCode + user.phoneNumber,
										from: "+12182640309",
										body: "Welcome to Giftbomb! Please use the verification code " + otp + ", to complete registration.",
									}, function (err, message) {
										console.log("message sid", message.sid);
										resolve(STATUS("SC200", "User already registered", otpUpdate));
									});


								}
							})

						} else {
							var newUser = new userModel();
							newUser.phoneNumber = user.phoneNumber.trim();
							newUser.otp = otp;
							newUser.countryCode = user.countryCode;
							newUser.country = user.country;
							newUser.newUser = true;
							newUser.deviceType = user.deviceType ? user.deviceType : "";
							newUser.deviceId = user.deviceId ? user.deviceId : "";
							newUser.deviceToken = user.deviceToken ? user.deviceToken : "";
							newUser.accountStatus = serverConstants["account_status"]["ACTIVE"]
							newUser.save(function (err, userData) {
								if (err) {
									reject(STATUS("SC202", "", err))
								} else {


									client.messages.create({
										to: user.countryCode + user.phoneNumber,
										from: "+12182640309",
										body: "Welcome to Giftbomb! Please use the verification code " + otp + ", to complete registration.",
									}, function (err, message) {
										if(err){
											userModel.remove({phoneNumber:newUser.phoneNumber, countryCode:newUser.countryCode, accountStatus:serverConstants["account_status"]["ACTIVE"]},(err,dbDara)=>{
												
											})
										}
										console.log("message sid", message.sid);
										delete userData["contactList"];
										resolve(STATUS("SC200", "New user registered", userData));
									});

								}
							})

						}

					} else {
						var newUser = new userModel();
						newUser.phoneNumber = user.phoneNumber.trim();
						newUser.otp = otp;
						newUser.countryCode = user.countryCode;
						newUser.country = user.country;
						newUser.newUser = true;
						newUser.deviceType = user.deviceType ? user.deviceType : "";
						newUser.deviceId = user.deviceId ? user.deviceId : "";
						newUser.deviceToken = user.deviceToken ? user.deviceToken : "";
						newUser.accountStatus = serverConstants["account_status"]["ACTIVE"]
						newUser.save(function (err, userData) {
							var dbdata = {
								"stripe_customerId": ""
							};
							dbdata["accountStatus"] = userData["accountStatus"];
							dbdata["otp"] = otp;
							dbdata["newUser"] = true;
							dbdata["phoneNumber"] = userData.phoneNumber.trim();
							dbdata["deviceToken"] = userData.deviceToken ? user.deviceToken : "";
							dbdata["deviceId"] = userData.deviceId ? user.deviceId : "";
							dbdata["deviceType"] = userData.deviceType ? user.deviceType : "";
							dbdata["country"] = userData.country;
							dbdata["countryCode"] = userData.countryCode;
							dbdata["_id"] = userData._id;
							dbdata["favourite"] = userData.favourite;
							dbdata["status"] = userData.status
							if (err) {
								reject(STATUS("SC202", "", err))
							} else {

								stripe.customers.create({
									description: " Customer created for " + newUser.phoneNumber + "at " + new Date(),

								}, function (err, customer) {
									console.log("customer deatils", customer.id, customer, userData);
									if (!err) {
										dbdata["stripe_customerId"] = customer.id
										client.messages.create({
											to: user.countryCode + user.phoneNumber,
											from: "+12182640309",
											body: "Welcome to Giftbomb! Please use the verification code " + otp + ", to complete registration.",
										}, function (err, message) {
											console.log("message sid", message.sid);
											delete userData["dbdata"];
											resolve(STATUS("SC200", "New user registered", dbdata));
										});

									}
								})


							}
						})
					}
				})
			}
		})
		return promise;
	}
	this.otpVerify = function (user, headers) {
		var promise = new Promise(function (resolve, reject) {

			console.log("test");
			userModel.find({
				"phoneNumber": user.phoneNumber.trim(),
				"otp": user.otp.trim()
			}, {}, {
				lean: true,
				new: true
			}, function (err, otpMatch) {
				console.log(err, otpMatch);
				//remove comment and delete blow line this is for otp bypass
				//userModel.find({"phoneNumber":user.phoneNumber.trim()}, function(err, otpMatch){
				if (err) {
					reject(STATUS("SC202", "", err))
				} else if (otpMatch.length > 0) {
					var ip = headers['x-forwarded-for'] ? headers['x-forwarded-for'] : headers['host'];
					console.log(headers, "---> headers--->", headers.logintype);
					var tokenData = {
						id: otpMatch[0]._id,
						ip: ip,
						loginType: headers.logintype,
						date: Date.now()
					};

					var mongoData = otpMatch;
					TokenManager.setToken(tokenData, function (err, output) {
						console.log(err, output, "token data");
						if (err) {
							reject(err);
						} else {
							//							accessToken = output && output.accessToken || null;
							var accessToken = output && output.accessToken || null;
							mongoData[0]["accessToken"] = accessToken;
							//							otpMatch["token"]=accessToken;
              delete mongoData[0]["contactList"];
							resolve(STATUS("SC200", "OTP verify successfully", mongoData));
						}
					})

				} else {
					reject(STATUS("SC201", "Phone number not registered"));
				}
			});
		});
		return promise;
	}
	this.updateUserFirstTime = function (id, file, user) {
		var promise = new Promise(function (resolve, reject) {
			if (!user.email) {
				reject(STATUS("202", "Missing email address"));
			} else if (!user.fname) {
				reject(STATUS("202", "Missing First name"));
			} else if (!user.lname) {
				reject(STATUS("202", "Missing Last name"));
			} else if (!user.dob) {
				reject(STATUS("202", "Date Of Birth Missing"));
			} else if (!user.gender) {
				reject(STATUS("202", "Gender Missing"));
			} else {
				var email = user.email.toLowerCase();
				var gen = user.gender;
				var dob = user.dob;
				var fn = user.fname;
				var ln = user.lname;
				var image = "";
				if (file != undefined) {
					image = serverConstants.url.BASEURl + "/images/userThumbnail/" + file.filename;
				}
				userModel.findOneAndUpdate({
					"_id": id,
					"phoneNumber": user.phoneNumber
				}, {
					$set: {
						"newUser": false,
						"image": image,
						"email": email,
						"gender": gen,
						"dob": dob,
						"username.fname": fn,
						"username.lname": ln
					}
				}, {
					new: true
				}, function (err, data) {
					if (err) {
						reject({
							"error": "Internal server error"
						});
					} else {
						resolve(STATUS("SC200", "User updated successfully", data));
					}
				})
			}
		})
		return promise;
	}
	this.updateUserProfile = function (req) {
		var promise = new Promise(function (resolve, reject) {
			userModel.find({
				"_id": req.params.id
			}, function (err, userFound) {
				if (err) {
					reject(err);
				} else if (userFound.length > 0) {
					var email = req.body.email ? req.body.email.toLowerCase() : userFound[0].email;
					var image = '';
					if (req.file && req.file != undefined) {
						image = serverConstants.url.BASEURl + "/images/userThumbnail/" + req.file.filename;
					} else {
						image = userFound[0].image ? userFound[0].image : '';
					}
					var gen = req.body.gender ? req.body.gender : userFound[0].gender;
					var dob = req.body.dob ? req.body.dob : userFound[0].dob;
					var fn = req.body.fname ? req.body.fname : userFound[0].username.fname;
					var ln = req.body.lname ? req.body.lname : userFound[0].username.lname;
					var city = req.body.city ? req.body.city : userFound[0].city;
					var lat = req.body.lat ? req.body.lat : userFound[0].lat;
					var lon = req.body.lon ? req.body.lon : userFound[0].lon;
					userModel.findOneAndUpdate({
						"_id": userFound[0]._id
					}, {
						$set: {
							"lon": lon,
							"lat": lat,
							"city": city,
							"email": email,
							"gender": gen,
							"dob": dob,
							"username.fname": fn,
							"username.lname": ln,
							"image": image
						}
					}, {
						new: true
					}, function (err, data) {
						if (err) {
							reject(STATUS("SC202", "", err));
						} else {
							delete data["contactList"]
							resolve(STATUS("SC200", "User updated successfully", data));
						}
					})
				} else {
					reject(STATUS("SC202", "User Not Found"));
				}
			})
		})
		return promise;
	}
	this.updatePhoneNumber = function (req) {
		var promise = new Promise(function (resolve, reject) {
			userModel.find({
				"_id": req.params.id
			}, function (err, userFound) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (userFound.length > 0) {
					userModel.find({
						"phoneNumber": req.body.newNumber
					}, function (err, newUser) {
						if (newUser.length > 0) {
							resolve(STATUS("SC204", "This number is already exist."));
						} else {

							//generate 6 digit random number
							var otp = Math.floor(Math.random() * 899999 + 100000);
							userModel.findOneAndUpdate({
								"_id": userFound[0]._id
							}, {
								$set: {
									"otp": otp
								}
							}, {
								new: true
							}, function (err, data) {
								if (err) {
									resolve(STATUS("SC202", err));
								} else {
									client.messages.create({
										to: req.body.countryCode + req.body.newNumber,
										from: "+12182640309",
										body: "OTP " + otp,
									}, function (err, message) {
										if (err == null) {
											resolve(STATUS("SC200", "Verify New Phone Number", {
												"otp": otp
											}));
										} else {
											resolve(STATUS("SC202", err));
										}
									});
								}
							})
						}
					});
				} else {
					resolve(STATUS("SC202", "user not found"));
				}
			})
		})
		return promise;
	}


	this.updateOtpVerify = function (bodyData) {
		var promise = new Promise(function (resolve, reject) {

			if (!bodyData.oldNumberCountryCode) {
				resolve(STATUS("SC202", "Country Code of Old Mobile Number is missing"));
			}
			if (!bodyData.countryCode) {
				resolve(STATUS("SC202", "Country Code is missing"));
			} else if (!bodyData.oldNumber) {
				resolve(STATUS("SC202", "Old Mobile Number is missing"));
			} else if (!bodyData.newNumber) {
				resolve(STATUS("SC202", "New Mobile Number is missing"));
			} else if (!bodyData.country) {
				resolve(STATUS("SC202", "country is missing"));
			} else if (!bodyData.otp) {
				resolve(STATUS("SC202", "OTP is missing"));
			} else {
				userModel.find({
					"phoneNumber": bodyData.oldNumber,
					"countryCode": bodyData.oldNumberCountryCode
				}, function (err, data) {
					if (err) {
						resolve(STATUS("SC202", err));
					} else if (data.length > 0) {

						userModel.find({
							"phoneNumber": bodyData.newNumber,
							"countryCode": bodyData.countryCode
						}, function (err, newdata) {
							if (err) {
								resolve(STATUS("SC202", err));
							} else if (newdata.length > 0) {
								resolve(STATUS("SC204", "New number does not exist."));
							} else {
								if (bodyData.otp == data[0].otp) {
									userModel.findOneAndUpdate({
										"phoneNumber": bodyData.oldNumber
									}, {
										$set: {
											"phoneNumber": bodyData.newNumber,
											"countryCode": bodyData.countryCode,
											"country": bodyData.country,
											"otp": ""
										}
									}, {
										new: true
									}, function (err, updateData) {
										if (err) {
											resolve(STATUS("SC202", err));
										} else {
											resolve(STATUS("SC200", "Phone Number Updated Successfully", updateData));
										}
									})
								} else {
									resolve(STATUS("SC202", "OTP is invalid."));
								}
							}
						})
					} else {
						resolve(STATUS("SC202", "This phone number does not exist."));
					}
				})
			}
		})
		return promise;
	}
	this.getAlluser = function (req) {
		var promise = new Promise(function (resolve, reject) {
			var query = {};
			if (req.params && req.params.uid) {
				query._id = req.params.uid;
			}
			userModel.find(query, function (err, allUsers) {
				if (err) {
					reject(STATUS("SC202", "", err));
				} else if (allUsers.length > 0) {
					resolve(STATUS("SC200", "List of all users", allUsers));
				} else {
					reject(STATUS("SC202", "No user found, please check user id", allUsers));
				}
			})
		})
		return promise;
	}
	this.createUserByAdmin = function (req) {
		var promise = new Promise(function (resolve, reject) {
			adminModel.find({
				"_id": req.params.adminId
			}, function (err, adminUser) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else {
					if (adminUser[0].roles.indexOf("admin") > -1) {

						userModel.find({
							"phoneNumber": req.body.phoneNumber,
							"countryCode": req.body.countryCode
						}, function (err, foundUser) {
							if (err) {
								resolve(STATUS("SC202", err));
							} else if (foundUser.length > 0) {
								resolve(STATUS("SC202", "This phone number is already exist with another user"));
							} else {
								userModel.find({
									"email": req.body.email.toLowerCase()
								}, function (err, foundUser) {
									if (err) {
										resolve(STATUS("SC202", err));
									} else if (foundUser.length > 0) {
										resolve(STATUS("SC202", "This email address is already exist with another user"));
									} else {
										var newUser = new userModel();
										newUser.newUser = true;
										newUser.username.fname = req.body.fname;
										newUser.username.lname = req.body.lname;
										newUser.gender = req.body.gender;
										newUser.dob = req.body.dob;
										newUser.countryCode = req.body.countryCode;
										newUser.phoneNumber = req.body.phoneNumber;
										newUser.email = req.body.email.toLowerCase();
										newUser.save(function (err, data) {
											if (err) {
												resolve(STATUS("SC202", err));
											} else {
												resolve(STATUS("SC200", "New users created", data));
											}
										})
									}
								})
							}
						})
					} else {
						resolve(STATUS("SC202", "You don't have permission to add new user"));
					}
				}
			})
		})
		return promise;
	}



	this.updateFavourite = function (req) {
		var promise = new Promise(function (resolve, reject) {
			userModel.find({
				"_id": req.params.id,
				"favourite.listName": req.body.listName
			}, function (err, data) {
				if (err) {
					reject(STATUS("SC202", "", err));
				} else if (data.length > 0) {
					var isPublic = req.body.isPublic ? req.body.isPublic : false;
					userModel.findOneAndUpdate({
						"_id": req.params.id,
						"favourite.listName": req.body.listName
					}, {
						"favourite.$.listItem": req.body.listItem
					}, {
						new: true
					}, function (err, favouriteData) {
						if (err) {
							reject(STATUS("SC202", "", err));
						} else {
							resolve(STATUS("SC200", "favourite list updated successfully", favouriteData));
						}
					})
				} else {
					reject(STATUS("SC202", "List not found"));
				}
			})
		})
		return promise;
	}
	this.addFavourite = function (req) {
		var promise = new Promise(function (resolve, reject) {
			userModel.find({
				"_id": req.params.id
			}, function (err, data) {
				if (err) {
					reject(STATUS("SC202", "", err));
				} else if (data.length > 0) {
					reject(STATUS("SC202", "favourite with same list name already exist", err));
				} else {
					var newList = {}
					newList = req.body.listItem;
					userModel.update({
						"_id": req.params.id
					}, {
						$addToSet: {
							"favourite": newList
						}
					}, function (err, favouriteData) {
						if (err) {
							reject(STATUS("SC202", "", err));
						} else {
							resolve(STATUS("SC200", "favourite list added successfully"));
						}
					})
				}
			})
		})
		return promise;
	}
	this.deleteFavourite = function (req) {
		var promise = new Promise(function (resolve, reject) {
			userModel.find({
				"_id": req.params.id
			}, function (err, data) {
				if (err) {
					reject(STATUS("SC202", "", err));
				} else if (data.length > 0) {
					userModel.update({
						"_id": req.params.id
					}, {
						$pull: {
							"favourite": {
								"listName": req.body.listName
							}
						}
					}, function (err, favouriteData) {
						if (err) {
							reject(STATUS("SC202", "", err));
						} else {
							resolve(STATUS("SC200", "List deleted successfully"));
						}
					})
				} else {
					reject(STATUS("SC202", "List not found", err));
				}
			})
		})
		return promise;
	}
	this.updateCityLatlon = function (req) {
		var promise = new Promise(function (resolve, reject) {
			userModel.find({
				"_id": req.params.id
			}, function (err, userFound) {
				if (err) {
					reject(err);
				} else if (userFound.length > 0) {
					var city = req.body.city ? req.body.city : userFound[0].city;
					var lat = req.body.lat ? req.body.lat : userFound[0].lat;
					var lon = req.body.lon ? req.body.lon : userFound[0].lon;
					var con = req.body.contacts ? req.body.contacts : userFound[0].contacts
					userModel.findOneAndUpdate({
						"_id": userFound[0]._id
					}, {
						$set: {
							"lon": lon,
							"lat": lat,
							"city": city,
							"contacts": con
						}
					}, {
						new: true
					}, function (err, data) {
						if (err) {
							reject(STATUS("SC202", "", err));
						} else {
							resolve(STATUS("SC200", "User's city, lattitude and longitude updated successfully", data));
						}
					})
				} else {
					reject(STATUS("SC202", "User Not Found"));
				}
			})
		})
		return promise;
	}
	this.getUserCityByMobile = function (params) {
		var promise = new Promise(function (resolve, reject) {
			userModel.find({
				"phoneNumber": params.mobile,
				"accountStatus": serverConstants["account_status"]['ACTIVE']
			}, {
				"city": 1
			}, function (err, data) {
				if (err) {
					reject(STATUS("SC202", "", err));
				} else if (data.length > 0) {
					resolve(STATUS("SC200", "User city", data));
				} else {
					reject(STATUS("SC202", "No user found with this mobile " + params.mobile, err));
				}
			})
		})
		return promise;
	}

	/**
	 * 
	 */
	this.getUserList = function (req) {
		var limit = parseInt(req.limit);
		var skip = (limit * (req.page - 1));

		var promise = new Promise(function (resolve, reject) {
			var query = {};
			if (req.search) {
				//query = { "username.fname" : {  $regex: "/^"+req.search+"/i" } };
				query = {
					"username.fname": {
						$regex: new RegExp("^" + req.search, "i")
					}
				};
			}
			console.log("query", query);
			userModel.find(query).limit(limit).skip(skip).exec(function (err, allUsers) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (allUsers.length > 0) {
					userModel.count(query, function (err, c) {
						var Result = {
							rows: allUsers,
							totalRows: c
						}
						resolve(STATUS("SC200", "List of all users", Result));
					});
				} else {
					resolve(STATUS("SC202", "No user found, please check user id", allUsers));
				}
			})
		})
		return promise;
	}

	/**
	 *@createExcelFile is used to create excel file 
	 */
	this.createExcelFileForUser = function (req) {
		var query = {};
		if (req.searchText) {
			query = {
				"username.fname": {
					$regex: new RegExp("^" + req.searchText, "i")
				}
			};
		}
		var promise = new Promise(function (resolve, reject) {
			userModel.find(query, function (err, allUsers) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (allUsers.length > 0) {
					var str = "Sl No" + "," + "NAME" + "," + "Gender" + "," + "DOB" + "," + "Phone" + "," + "Email ID" + "," + "Status" + "\n";
					for (var i = 0; i < allUsers.length; i++) {

						var countryCode = (allUsers[i].countryCode !== undefined) ? allUsers[i].countryCode : '';
						var dob = (allUsers[i].dob !== undefined) ? dateFormat(allUsers[i].dob, "mmm d yyyy") : '';
						var fname = (allUsers[i].username.fname !== undefined) ? allUsers[i].username.fname : '';
						var lname = (allUsers[i].username.lname !== undefined) ? allUsers[i].username.lname : '';
						var gender = (allUsers[i].gender !== undefined) ? allUsers[i].gender : '';
						var phoneNumber = (allUsers[i].phoneNumber !== undefined) ? countryCode + allUsers[i].phoneNumber : '';
						var email = (allUsers[i].email !== undefined) ? allUsers[i].email : '';
						var status = (allUsers[i].status !== undefined) ? allUsers[i].status : '';

						str += (i + 1) + "," + fname + " " + lname + "," + gender + "," + dob + "," + phoneNumber + "," + email + "," + status + "\n";
					}
					var output = path.resolve('/home/giftbomb/giftbomb_mean/uploads/' + "file.xlsx");
					fs.writeFile(output, str, function (err) {
						if (err) {
							resolve(STATUS("SC202", err));
						} else {
							resolve(STATUS("SC200", "Success", allUsers));
						}
					});
				} else {
					resolve(STATUS("SC202", "No users found, please check user id"));
				}
			})
		})
		return promise;
	}

	/**
	 * 
	 */
	this.updateUserData = function (req) {
		var promise = new Promise(function (resolve, reject) {
			userModel.find({
				"_id": req.params.id
			}, function (err, userFound) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (userFound.length > 0) {
					var city = req.body.city ? req.body.city : userFound[0].city;
					var lat = req.body.lat ? req.body.lat : userFound[0].lat;
					var lon = req.body.lon ? req.body.lon : userFound[0].lon;
					var con = req.body.contacts ? req.body.contacts : userFound[0].contacts
					userModel.findOneAndUpdate({
						"_id": userFound[0]._id
					}, {
						$set: {
							"lon": lon,
							"lat": lat,
							"city": city,
							"contacts": con
						}
					}, {
						new: true
					}, function (err, data) {
						if (err) {
							resolve(STATUS("SC202", "", err));
						} else {
							resolve(STATUS("SC200", "User's city, lattitude and longitude updated successfully", data));
						}
					})
				} else {
					resolve(STATUS("SC202", "User Not Found"));
				}
			})
		})
		return promise;
	}

	/**
	 * 
	 */
	this.deleteUser = function (req) {
		var promise = new Promise(function (resolve, reject) {
			userModel.remove({
				"_id": req.params.id
			}, function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else {
					resolve(STATUS("SC200", "User has been deleted successfully", data));
				}
			})
		})
		return promise;
	}


	/**
	 *fetch Favourite List 
	 */
	this.fetchFavouriteList1 = function (id) {

		var result = [];
		var promise = new Promise(function (resolve, reject) {

			var mongoose = require('mongoose');
			var _id = mongoose.mongo.ObjectId(id);

			var aggregate = [
					{
						$match: {
							"_id": _id
						}
					},
					{
						$unwind: "$favourite"
					},
					{
						$lookup: {
							"from": "stores",
							"localField": "favourite",
							"foreignField": "_id",
							"as": "storeData"
						}
					}
            ]
				//console.log(aggregate);
			userModel.aggregate(aggregate, function (err, data) {
				if (err) {
					resolve(STATUS("SC200", err));
				} else {
					for (var i = 0; i < data.length; i++) {
						var row = {
							storeId: (data[i].storeData[0]._id !== undefined) ? data[i].storeData[0]._id : '',

							category: (data[i].storeData[0].accountInfo !== undefined && data[i].storeData[0].accountInfo.category !== undefined) ? data[i].storeData[0].accountInfo.category : '',
							storeName: (data[i].storeData[0].accountInfo !== undefined && data[i].storeData[0].accountInfo.storeName !== undefined) ? data[i].storeData[0].accountInfo.storeName : '',
							category: (data[i].storeData[0].accountInfo !== undefined && data[i].storeData[0].accountInfo.category !== undefined) ? data[i].storeData[0].accountInfo.category : '',
							storeLogo: (data[i].storeData[0].accountInfo.storeLogo !== undefined && data[i].storeData[0].accountInfo.storeLogo !== undefined) ? serverConstants.url.BASEURl + "/uploads/" + data[i].storeData[0].accountInfo.storeLogo : '',

						}
						for (var j = 0; j < categories.length; j++) {
							if (row.category == categories[i]["plural"]) {
								row.category = categories[i]["singular"];
								row.pluralCategory = categories[i]["plural"];
							} else {

							}
						}



						result.push(row);
					}
					resolve(STATUS("SC200", "Success", result));
				}
			})
		})
		return promise;
	}


	this.accountdelete = (payloadData, callback) => {


		userModel.findOneAndUpdate({
			_id: payloadData.id
		}, {
			$set: {
				accountStatus: serverConstants["account_status"]["DELETED_BY_USER"]
			}
		}, {
			lean: true
		}, (err, dbData) => {
			console.log(err, dbData, "----->>> account status delete");
			if (!err) {
				callback(null, STATUS("SC200", "User is deleted successfully."));
			} else {
				callback(STATUS("SC202", "There is some problem in deleting user."))
			}
		});
	}

	this.uploadContactList = (payloadData, callback) => {
		var query = {
			_id: payloadData.id
		}

		var update = {
			$push: {
				contactList: payloadData.contactList
			}
		}
  console.log(payloadData,"----> payloadData");
		userModel.findOneAndUpdate(query, update, {
			lean: true
		}, (err, dbData) => {
			console.log(err,dbData);
			if (!err) {
				callback(null, STATUS("SC200", "Contact List updated succesfully."));
			}else{
				callback(err);
			}
		});


	}
	this.updateSettings= (payloadData, callback)=>{
		  console.log(payloadData,"=======>payload")
		userModel.findOneAndUpdate({_id:payloadData.userId},{$set:{"wishlistPublic":payloadData.wishlistPublic, "notification":payloadData.notification}},{lean:true},(err,data)=>{
			console.log("db response", err,data);
			if(!err){
				callback(null, STATUS("SC200", "User updated succesfully.", data));
			}else{
				callback(err);
			}
		})
	}


	return this;
}());

module.exports = adminCtrl;