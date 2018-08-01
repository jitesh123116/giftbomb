/*
 * @Author: Sachin kumar
 * @Date:   19/june/2017
 */
 
var express = require('express');
var router = express.Router();
var commonCntrl = require('./commonCntrl');
var _= require("underscore");

var TokenManager= require('../utilities/tokenManager');

router.use(function (request, res, next) {
	console.log('request path>>', request.path);
	var excludedPath = ['/login','/otp-verify'];

	if (_.contains(excludedPath, request.path)) {
		return next();
	} else {
	  
		console.log(request.headers.logintype)
		if (request.headers.logintype == "APP") {
			TokenManager.verifyToken(request.headers.authorization, function (err, token) {
   console.log(err, token," verify err, token");
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



// user full detail with favoruite and featured list recent 5 transaction and categoies
router.get('/user/:id/:city?', function(req, res){
	commonCntrl.getUserFullData(req.params)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// user favoruite and featured list
router.post('/getUserWithFeatured', function(req, res){
 console.log(req.body);
	commonCntrl.getUserWithFeatured(req.body)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

/**
 *@getFeaturedList 
 */
router.get('/api/:id/:city/:featuredName', function(req, res){
	commonCntrl.getAllFeaturedList(req.params)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})


router.get("/storeNames/:city?/:categoryName?",function(req,res){
	
	commonCntrl.getStoreNames(req.params, (err,data)=>{
		console.log("----> err,data, get store names",err,data);
		if(!err){
			res.send(data);
		}else{
			res.status(401).send(err);
		}
	});
	
	
});


module.exports = router;