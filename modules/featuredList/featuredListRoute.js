/*
 * @Author: Sachin kumar
 * @Date:   12/june/2017
 */
 
var express = require('express');
var router = express.Router();
var FLCtrl = require('./featuredListCntrl');
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

// add new featured list
router.post('/', function(req, res){	
	FLCtrl.addFeaturedList(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// update featured list
router.put('/', function(req, res){	
	FLCtrl.updateFeaturedList(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// get featuredList by id
router.get('/id/:id', function(req, res){
	FLCtrl.getFeaturedListById(req.params)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// get all featured list or citywise
router.get('/:city?', function(req, res){
	FLCtrl.getFeaturedListApi(req.params)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// get all featured list or citywise
router.post('/fetchDistinctFeaturedCities', function(req, res){        
    FLCtrl.fetchDistinctFeaturedCities(req)
    .then(function(data){
            res.send(data);
    }, function(err){
            res.status(401).send(err);
    })
})


// get all featured list or citywise
router.post('/fetchData', function(req, res){
    
    FLCtrl.getFeaturedListData(req.body)
    .then(function(data){
            res.send(data);
    }, function(err){
            res.status(401).send(err);
    })
})

// get all featured list or citywise
router.post('/fetchFeaturedData', function(req, res){    
    FLCtrl.fetchFeaturedData(req.body)
    .then(function(data){
            res.send(data);
    }, function(err){
            res.status(401).send(err);
    })
})

module.exports = router;