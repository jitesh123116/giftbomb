/*
 * @Author: Vinay kumar
 * @Date:   08/june/2017
 */
 
var express = require('express');
var router = express.Router();
var merchantController = require('./merchantController');
var TokenManager= require('../utilities/tokenManager');
var _= require("underscore");
router.use(function (request, res, next) {
	
		if (request.headers.loginType == "APP") {
			TokenManager.verifyToken(request.headers.authorization, function (err, token) {

				if (!err) {

					var secCheck = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'] : request.headers['host'];

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

	
});



router.post('/login', function(req, res){
	merchantController.login(req.body)
	.then(function(data){
		res.send(data)
	}, function(err){
		res.status(401).send(err);
	})
})

router.post('/create', function(req, res){
	merchantController.createAdmin(req.body)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

router.put('/change-password/:id', function(req, res){
	merchantController.changePassword(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

router.put('/reset-password/:id', function(req, res){
	merchantController.resetPassword(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// reset password request
router.put('/reset-password-request', function(req, res){
	merchantController.resetRequest(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// update admin profile
router.put('/:id', function(req, res){
	merchantController.updateProfile(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

module.exports = router;
