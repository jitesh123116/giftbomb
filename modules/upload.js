var fs = require('fs');
var multer = require('multer');
var path = require('path');
var express = require('express');
var router = express.Router();

  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
    var newDestination = path.join(__dirname+"/../client/images/userThumbnail");
    try {
      fs.statSync(newDestination);
		} catch (err) {
		  fs.mkdirSync(newDestination);
		}
      cb(null, newDestination);
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  router.post("/userThumbnail", multer({storage : storage}).single('file'), function(req, res) {
    console.log("filePath",req.file);
    console.log("req body",req.body);
    var filePath = "file not defined";
    if(req.file != undefined){
     filePath = req.file.originalname;          
    }
    res.status(200).send(filePath);
  });

module.exports = router;