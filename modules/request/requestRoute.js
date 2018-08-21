/*
 * @Author: Sachin kumar
 * @Date:   16/june/2017
 */
 
var express = require('express');
var router = express.Router();
var requestCtrl = require('./requestCtrl');
var multer = require('multer');
var serverConstants = require('../serverConstants');
var stripe = require("stripe")("sk_test_iRzKKdCdoOF3IuXaHsHjHkbG");
var _= require("underscore");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
         cb(null, serverConstants.url.DOCUMENT_ROOT_UPLOAD)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    }
})
var upload = multer({ storage: storage });

var storageForStoreLogo = multer.diskStorage({
    destination: function (req, file, cb) {
         cb(null, serverConstants.url.DOCUMENT_ROOT_STORELOGO)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    }
})
var uploadForStoreLogo = multer({ storage: storageForStoreLogo });
var TokenManager= require('../utilities/tokenManager');


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
router.post('/',upload.single('storeImage'), function(req, res){
	requestCtrl.addRequestForData(req)
	.then(function(data){
		res.send(data);
	}, function(err){
          var status = {
            status : {status : 401},
            error : err
          } 
	  res.send(status);
	})
})


router.post('/stripe_key_generation', (req, res) => {
	console.log(req.body, req.query, req.body.params, "---> 123stripe generation");
  const stripe_version = req.body.api_version;
  if (!stripe_version) {
    res.status(400).end();
    return;
  }
	
	console.log("---> stripe version",stripe_version);
  // This function assumes that some previous middleware has determined the
  // correct customerId for the session and saved it on the request object.
  stripe.ephemeralKeys.create(
    {customer: req.body.customerId},
    {stripe_version: stripe_version}
  ).then((key) => {
		
		console.log("======>key print", key);
    res.status(200).json(key);
  }).catch((err) => {
		
		console.log("=======>err",err);
    res.status(500).end();
  });
});




// Create request
router.post('/createRequestForDesign',uploadForStoreLogo.single('storeImage'), function(req, res){
	requestCtrl.addRequestForData(req)
	.then(function(data){
		res.send(data);
	}, function(err){
          var status = {
            status : {status : 401},
            error : err
          } 
	  res.send(status);
	})
})



// get all request or single request by id
router.get('/:id', function(req, res){
	requestCtrl.getRequestForData(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// get all request filter by type
router.get('/type/:type/:limit/:page/:status', function(req, res){        
  requestCtrl.getRequestOfTypeData(req)
  .then(function(data){
          res.send(data);
  }, function(err){
          res.status(401).send(err);
  })
})

// update request status
router.put('/:id', function(req, res){
	requestCtrl.updateApprove(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

router.post('/fetch', function(req, res){    
    // console.log("err-fetch",req.body);
    requestCtrl.fetchDataForRequest(req.body)
    .then(function(data){
           //  console.log("err-route1");
            res.send(data);
    }, function(err){
           // console.log("err-route",err);
            res.status = 401;
            res.send(err);
    })
})

router.post('/updateData', upload.single('storeImage'), function(req, res){   
    requestCtrl.updateDataForRequest(req)
    .then(function(data){
            res.send(data);
    }, function(err){
            res.status(401).send(err);
    })
})

/**
 * 
 */
router.post('/updateRequestForDesign', uploadForStoreLogo.single('storeImage'), function(req, res){    
    requestCtrl.updateDataForRequest(req)
    .then(function(data){
            res.send(data);
    }, function(err){
            res.status(401).send(err);
    })
})


/**
 * 
 */
router.post('/updateLocationRequest',  function(req, res){    
    requestCtrl.updateLocationRequest(req.body.where, req.body.column)
    .then(function(data){
            res.send(data);
    }, function(err){
            res.status(401).send(err);
    })
})

/**
 * 
 */
router.post('/removeLocationRequest',  function(req, res){    
    requestCtrl.removeLocationRequest(req.body.where,req.body.type)
    .then(function(data){
            res.send(data);
    }, function(err){
            res.status(401).send(err);
    })
})


module.exports = router;
