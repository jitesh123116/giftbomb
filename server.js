'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config');
var async = require('async');

// require router file


var app = express();
app.use(bodyParser.json());
mongoose.connect(db.url);

app.use('/', express.static(__dirname + '/client'));



app.use('/', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
})


app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD');
	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-HTTP-Method-Override,loginType');
	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);
	// Pass to next layer of middleware
	next();
});





app.listen(3000, function(){
 console.log("server start at port: 3000");
});