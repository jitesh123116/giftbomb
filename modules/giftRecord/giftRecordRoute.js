/*
 * @Author: Sachin kumar
 * @Date:   16/june/2017
 */
 
var express = require('express');
var router = express.Router();
var GRC = require('./giftRecordCntrl');
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		var newDestination = path.join(__dirname + "/../../client/images/userThumbnail");
		cb(null, newDestination);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname + Date.now() + ".png");
	}
});

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

// Create gift record
router.post('/', function(req, res){
	GRC.addGiftRecord(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// get gift record
router.get('/:idOrMobile?', function(req, res){
	GRC.getGiftRecord(req.params)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// update gift record
router.put('/:cardNumber', function(req, res){
	GRC.updateGiftRecord(req.params,req.body)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
});


//giftedTo:[{phoneNumber:"", countryCode:"","contactNam":""},{phoneNumber:"", countryCode:"","contactNam":""},{phoneNumber:"", countryCode:"","contactNam":""}],
//storeId:"",
//giftAmount:"",
//message:"", //transactionId:"",
			
router.post("/byUser",multer({
		storage: storage
	}).single('multimedia'),function(req,res){
	
	console.log("body", req.body);
	GRC.postgiftByUser(req.body, (err,data)=>{
		if(!err){
			res.status(200).send(data);
		}else{
			res.status(400).send(err);
		}
	})
})



module.exports = router;