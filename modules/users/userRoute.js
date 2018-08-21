/*
 * @Author: Sachin kumar
 * @Date:   08/june/2017
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var path = require('path');
var userCntrl = require('./userCntrl');
let expressJoi = require('express-joi-validator'),
	Joi = require('joi');
let serverConstants = require('../serverConstants');
var _ = require("underscore");
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		var newDestination = path.join(__dirname + "/../../client/images/userThumbnail");
		cb(null, newDestination);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname + Date.now() + ".png");
	}
});

var stripe = require("stripe")("sk_test_iRzKKdCdoOF3IuXaHsHjHkbG");
var TokenManager = require('../utilities/tokenManager');



router.use(function (request, res, next) {
	console.log('request path>>', request.path);
	var excludedPath = ['/login', '/otp-verify'];

	if (_.contains(excludedPath, request.path)) {
		return next();
	} else {

		console.log(request.headers.logintype)
		if (request.headers.logintype == "APP") {
			TokenManager.verifyToken(request.headers.authorization, function (err, token) {
				console.log(err, token, " verify err, token");
				if (!err) {

					var secCheck = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'] : request.headers['host'];
					console.log()
					if (token.userData.ip === secCheck) {
						request.userData = token.userData;
						next();
					} else if (Date.now - token.userData.date < 30 * 60000) {
						request.userData = token.userData;
						next();
					} else {
						next();
						//						logging.consolelog('error 1')
						//						res.send({
						//							"status": {
						//								status: "400",
						//								type: "RENEW_TOKEN",
						//								message: "Please renew your token."
						//							},
						//							"data": "null"
						//						});
					}

				} else {

					res.send({
						"status": {
							status: "403",
							type: "INVALID_TOKEN",
							message: "Your token has been expired."
						},
						"data": "null"
					});
				}
			});

		} else {
			next();
		}

	}
});

// user login
router.post('/login', function (req, res) {
	userCntrl.loginUser(req.body)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})
})




router.post('/stripe_key_generation', function (req, res) {
	console.log(req.body, "---> 123stripe generation");
	const stripe_version = req.body.api_version;
	if (!stripe_version) {
		res.status(400).end();
		return;
	}

	console.log("---> stripe version", stripe_version);
	// This function assumes that some previous middleware has determined the
	// correct customerId for the session and saved it on the request object.
	stripe.ephemeralKeys.create({
		customer: req.body.customerId
	}, {
		stripe_version: stripe_version
	}).then((key) => {

		console.log("======>key print", key);
		res.status(200).json(key);
	}).catch((err) => {

		console.log("=======>err", err);
		res.status(500).end();
	});
});

// user creation by admin
router.post('/create/:adminId', function (req, res) {
		userCntrl.createUserByAdmin(req)
			.then(function (data) {
				res.send(data);
			}, function (err) {
				res.status(401).send(err);
			})
	})
	// update user first time reference-https://stackoverflow.com/questions/31530200/node-multer-unexpected-field
router.put('/new/:id', multer({
		storage: storage
	}).single('profileImg'), function (req, res) {
		userCntrl.updateUserFirstTime(req.params.id, req.file, req.body)
			.then(function (data) {
				res.send(data);
			}, function (err) {
				res.status(401).send(err);
			})
	})
	// router.put('/new/:id', function(req, res){
	// 	var upload = multer({
	// 		storage: storage,
	// 		fileFilter: function(req, file, callback) {
	// 			var ext = path.extname(file.originalname)
	// 			if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
	// 				return {"error":"Only images are allowed"};
	// 			}else{
	// 				callback(null, true)
	// 			}
	// 		}
	// 	}).single('file')
	// 	upload(req, res, function(err, data) {
	// 		userCntrl.updateUserFirstTime(req.params.id,req.file, req.body)
	// 		.then(function(data){
	// 			res.send(data);
	// 		}, function(err){
	// 			res.status(401).send(err);
	// 		})
	// 	})
	// })

// update mobile number
router.put('/mobile/:id', function (req, res) {
		userCntrl.updatePhoneNumber(req)
			.then(function (data) {
				res.send(data);
			}, function (err) {
				res.status(401).send(err);
			})
	})
	// add new favourite
router.post('/favourite/:id', function (req, res) {
		userCntrl.addFavourite(req)
			.then(function (data) {
				res.send(data);
			}, function (err) {
				res.status(401).send(err);
			})
	})
	// update user favourite
router.put('/favourite/:id', function (req, res) {
		userCntrl.updateFavourite(req)
			.then(function (data) {
				res.send(data);
			}, function (err) {
				res.status(401).send(err);
			})
	})
	// delete user favourite
router.delete('/favourite/:id', function (req, res) {
	userCntrl.deleteFavourite(req)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})
})

// otp verify
router.post('/otp-verify', function (req, res) {
		console.log("route data", req.headers);
		userCntrl.otpVerify(req.body, req.headers)
			.then(function (data) {
				console.log("---> data get", data);
				res.send(data);
			}, function (err) {
				res.status(401).send(err);
			})
	})
	// otp verify on phone number update
router.post('/update-phone-number/otp-verify', function (req, res) {
		userCntrl.updateOtpVerify(req.body)
			.then(function (data) {
				res.send(data);
			}, function (err) {
				res.status(401).send(err);
			})
	})
	// user profile update
router.put('/:id', multer({
		storage: storage
	}).single('profileImg'), function (req, res) {
		userCntrl.updateUserProfile(req)
			.then(function (data) {
				res.send(data);
			}, function (err) {
				res.status(401).send(err);
			})
	})
	// update city lat lon
router.put('/update/:id', function (req, res) {
	userCntrl.updateCityLatlon(req)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})
})

// get all users used by admin or individual user by passing userid
router.get('/:uid?', function (req, res) {
		userCntrl.getAlluser(req)
			.then(function (data) {
				res.send(data);
			}, function (err) {
				res.status(401).send(err);
			})
	})
	// get user by mobile number
router.get('/city/:mobile', function (req, res) {
	userCntrl.getUserCityByMobile(req.params)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})
})

router.post('/getUserList', function (req, res) {
	userCntrl.getUserList(req.body)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})
})


// delete user 
router.delete('/deleteUser/:id', function (req, res) {
	userCntrl.deleteUser(req)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})
})


// 

router.post('/excelFileData', function (req, res) {
	userCntrl.createExcelFileForUser(req.body)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})

})

/**
 *@fetchFavouriteList to find out favourite list 
 */
router.get('/fetchFavouriteList/:id', function (req, res) {
	userCntrl.fetchFavouriteList1(req.params.id)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})
})



/**
 *@deleteuser API 
 */


router.post('/renewApi', function (req, res) {
	userCntrl.accountdelete(req, res)

});


router.post('/account/delete', expressJoi({
	body: Joi.object().keys({
		id: Joi.string().required(),
		accountStatus: Joi.string().required().valid([serverConstants["account_status"]["ACTIVE"], serverConstants["account_status"]["DELETED_BY_USER"], serverConstants["account_status"]["DELETED_BY_ADMIN"]])
	})
}), (req, res) => {

	userCntrl.accountdelete(req.body, (err, data) => {

		let statusCode = 200;
		if (data && data.statusCode) {
			statusCode = data.statusCode;
		} else if (err && err.statusCode) {
			statusCode = err.statusCode;
		}
		if (!err) {
			res.status(statusCode).send(data);
		} else {

			res.status(statusCode).send(err);
		}

	})
});

//id, contactList:[{phoneNumber:"", countryCode:""},{phoneNumber:"", countryCode:""}]
router.post("/uploadContactList", (req, res) => {
	userCntrl.uploadContactList(req.body, (err, data) => {
		if (!err) {
			res.status(200).send(data);
		} else {
			res.status(400).send(err);
		}
	});
});
//userId, wishlistPublic, notification

router.post("/updateSettings", (req, res) => {
	console.log(req.body,"---> body");
	userCntrl.updateSettings(req.body, (err, dbData) => {
		console.log(err, dbData);
		if (!err) {
			res.status(200).send(dbData);
		} else {
			res.status(400).send(err);
		}
	})
})


module.exports = router;