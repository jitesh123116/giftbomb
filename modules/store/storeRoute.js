/*
 * @Author: Sachin kumar
 * @Date:   09/june/2017
 */
 
var express = require('express');
var router = express.Router();
var storeCntrl = require('./storeCntrl');
var multer = require('multer');
var serverConstants = require('../serverConstants');
var _= require("underscore");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
			console.log("000",serverConstants.url.DOCUMENT_ROOT_UPLOAD);
        cb(null, serverConstants.url.DOCUMENT_ROOT_UPLOAD)
    },
    filename: function (req, file, cb) {
			console.log("111",Date.now() + '-' + file.originalname );
        cb(null, Date.now() + '-' + file.originalname)      
    }
})
var upload = multer({ storage: storage });
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

/*

router.post('/', upload.single('image'), function(req, res)  {  
      console.log("body",req.body);
      console.log("file",req.file.filename);
      console.log("files",req.files);
});
*/


// create store with default branch

var cpUpload = upload.fields([{ name: 'storeImage', maxCount: 1 }, { name: 'storeLogo', maxCount: 1 }])
router.post('/', cpUpload,function(req, res){
	
	console.log("request.files", req.files);
        	
        storeCntrl.createStore(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
       
})



var cpUpload = upload.fields([{ name: 'storeImage', maxCount: 1 }, { name: 'storeLogo', maxCount: 1 }])
router.post('/editStore',cpUpload, function(req, res){
        console.log("editStore route")  	
        storeCntrl.editStore(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
       
})



// get all store categories
router.get('/categories', function(req, res){
	storeCntrl.getAllCategories()
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// get all store city
router.get('/city', function(req, res){
	storeCntrl.getAllStoreCity()
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// search store
router.get('/search', function(req, res){
	storeCntrl.searchStore(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// create branch
router.post('/branch', function(req, res){
	storeCntrl.createBranch(req.body)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// get all branches, store category wise
router.get('/branch/:cat?/:city?', function(req, res){
	storeCntrl.getBranch(req.params)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// update branch
router.put('/branch/:bid', function(req, res){
	storeCntrl.updateBranch(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// get specific branch for store
router.get('/branch/city/:sid/:branchCity', function(req, res){
	storeCntrl.singleBranchForStore(req.params,req.query)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// Activate/Deactivate Branch if not a default branch
router.put('/change-status/:bid', function(req, res){
	storeCntrl.changeBranchStatus(req.params)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// get single store with their all branch
router.get('/single/:sid/:lat?/:long?', function(req, res){
	storeCntrl.getStoreWithAllBranches(req.params)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
router.get('/admin/single/:sid/:lat?/:long?', function(req, res){
	storeCntrl.getStoreWithAllBranchesforadmin(req.params)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// update store 
router.put('/:sid', function(req, res){
	storeCntrl.updateStore(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// get all stores with default branch OR get all stores category wise
router.get('/:cat?', function(req, res){
	storeCntrl.getAllStores(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// add likes
router.post('/likes/:uid/:sid', function(req, res){
	storeCntrl.updateLikes(req.params.uid,req.params.sid)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// get all stores with default branch OR get all stores category wise
router.post('/fetch', function(req, res){        
	storeCntrl.fetchStore(req.body)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})


router.post('/updateData', function(req, res){   
    storeCntrl.updateDataFor(req.body.where, req.body.column)
    .then(function(data){
            res.send(data);
    }, function(err){
            res.status(401).send(err);
    })
})

//get branch with id
router.get('/branchid/id/:bid', function(req, res){     
        console.log("bid route",req.params.bid);
	storeCntrl.getBranchWithId(req.params.bid)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

router.post('/resetPasswordRequest', function(req, res){
        console.log("bid route",req.body);
       
	storeCntrl.resetRequest(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
         
})

// search store
router.get('/searchStoreApi/:search', function(req, res){
	storeCntrl.searchStoreApi(req.params.search)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})



// increase count of the string
router.post('/saveSearchString', (req, res) => {
	storeCntrl.saveSearchString(req.body)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// 
router.post('/excelFileData', function(req, res){  
    storeCntrl.createExcelFile(req.body)
    .then(function(data){  
      res.send(data);
    }, function(err){      
      res.status(401).send(err);
    })
        
})



router.get('/record/fetchSearchRecord', function(req, res){
	
	storeCntrl.fetchSearchRecord(req)
	.then(function(data){
		res.send(data);
		console.log()
	}, function(err){
		res.status(401).send(err);
	})
}) 


// get specific branch for store
router.get('/branch/location/:sid/:locationName', function(req, res){
	storeCntrl.fetchBranchData(req.params,req.query)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

router.post('/getCategoriesCityBasis', function(req, res){
  storeCntrl.getCategoriesCityBasis(req.body.city)
  .then(function(data){
          res.send(data);
  }, function(err){
          res.status(401).send(err);
  })
})

router.post('/getBranchWithLimit', function(req, res){
  storeCntrl.getBranchWithLimit(req.body)
  .then(function(data){
          res.send(data);
  }, function(err){
          res.status(401).send(err);
  })
})

/**
 * 
 */
router.post('/updateBranchData', function(req, res){   
    storeCntrl.updateDataFor(req.body.where, req.body.column)
    .then(function(data){
            res.send(data);
    }, function(err){
            res.status(401).send(err);
    })
})

/**
 *@Roting for the change password method
 */ 
 router.post('/changePassword', function(req, res){  
 	console.log("req.body.where",req.body.where);
 	console.log("req.body.column",req.body.oldPassword);

    storeCntrl.changePasswordForStore(req.body.where, req.body.column, req.body.oldPassword.oldPassword)
    .then(function(data){
            res.send(data);
    }, function(err){
            res.status(401).send(err);
    })
})



module.exports = router;
