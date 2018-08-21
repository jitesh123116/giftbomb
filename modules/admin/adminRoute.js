/*
 * @Author: Sachin kumar
 * @Date:   08/june/2017
 */
 
var express = require('express');
var router = express.Router();
var adminCntrl = require('./adminCntrl');




router.post('/login', function(req, res){
  
        console.log("login route");
	adminCntrl.loginData(req.body)
	.then(function(data){
		res.send(data)
	}, function(err){
		res.status(401).send(err);
	})
})

router.post('/create', function(req, res){
	adminCntrl.createAdmin(req.body)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

router.put('/change-password/:id', function(req, res){
	adminCntrl.toChangePassword(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

router.put('/reset-password/:id', function(req, res){
	adminCntrl.resetPassword(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// reset password request
router.put('/reset-password-request', function(req, res){
       
	adminCntrl.resetRequestData(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// update admin profile
router.put('/:id', function(req, res){
	adminCntrl.updateProfile(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})


router.post('/fetchData', function(req, res){   
    
    //console.log("req.body.where",req.body);
   // console.log("req.body.where",req.body.where);
  
    adminCntrl.fetchDataForAdmin(req.body.where)
    .then(function(data){
      res.send(data);
    }, function(err){
      res.status(401).send(err);
    })
})


module.exports = router;
