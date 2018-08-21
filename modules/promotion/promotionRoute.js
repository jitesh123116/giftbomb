/*
 * @Author: Vinay kumar
 * @Date:   17/july/2017
 */

var express = require('express');
var router = express.Router();
var promotionCtrl = require('./promotionCtrl');

var TokenManager = require('../utilities/tokenManager');
var _ = require("underscore");
router.use(function (request, res, next) {

	if (request.headers.logintype == "APP") {
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




// Create request
router.post('/', function (req, res) {
	promotionCtrl.addPromotionRequest(req)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})
})

// get all request 
router.get('/fetchPromotionRequest/:limit/:page', function (req, res) {
	promotionCtrl.fetchPromotionRequest(req)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})
})

// create excel file
router.get('/createExcelFileForPromotions', function (req, res) {
	promotionCtrl.createExcelFileForPromotions(req)
		.then(function (data) {
			res.send(data);
		}, function (err) {
			res.status(401).send(err);
		})
})


router.get("/admin/promotionList", function(req, res) {

			promotionCtrl.getList(req.query, (err, data) => {
					if (!err) {
						res.status(200).send(data);
					} else {
						res.status(400).send(err);
					}
				});

			});




module.exports = router;