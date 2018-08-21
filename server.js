'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config');
var async = require('async');

// require router file
var adminRoute = require('./modules/admin/adminRoute');
var userRoute = require('./modules/users/userRoute');
var storeRoute = require('./modules/store/storeRoute');
var countryRoute = require('./modules/country/countryRoute');
var uploadRoute = require('./modules/upload');
var featureRoute = require('./modules/featuredList/featuredListRoute');
var giftRecordRoute = require('./modules/giftRecord/giftRecordRoute');
var commonRoute = require('./modules/commonApi/commonRoute');
var merchantRoute = require('./modules/merchant/merchantRoute');
var requestRoute = require('./modules/request/requestRoute');
var promotionRoute = require('./modules/promotion/promotionRoute');
var notificationRoute = require("./modules/notifications/notificationRoute.js")


var giftService = require("./modules/giftRecord/giftRecordCntrl")
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var CronJob = require('cron').CronJob;
var app = express();
app.use(bodyParser.json());
mongoose.connect(db.url);

app.use('/', express.static(__dirname + '/client'));

app.use('/html', express.static(__dirname + '/html'));

//merchant panel
app.use('/merchant', express.static(__dirname + '/merchant'));
app.use('/uploads', express.static(__dirname + '/uploads'));

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

app.post('/stripe_key_generation', (req, res) => {
	console.log(req, "---> stripe generation");
	const stripe_version = req.body.api_version;
	if (!stripe_version) {
		res.status(400).end();
		return;
	}

	console.log("---> stripe version", stripe_version);
	// This function assumes that some previous middleware has determined the
	// correct customerId for the session and saved it on the request object.
	stripe.ephemeralKeys.create({
		customer: req.body.customerId
	}, {
		stripe_version: stripe_version
	}).then((key) => {

		console.log("======>key print", key);
		res.status(200).json(key);
	}).catch((err) => {

		console.log("=======>err", err);
		res.status(500).end();
	});
});


app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/store', storeRoute);
app.use('/country', countryRoute);
app.use('/upload', uploadRoute);
app.use('/feature', featureRoute);
app.use('/gift-record', giftRecordRoute);
app.use('/common', commonRoute);
app.use('/merchant', merchantRoute);
app.use('/request', requestRoute);
app.use('/promotion', promotionRoute);
app.use("/notification", notificationRoute);

if (cluster.isMaster) {
	console.log("master processor")
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	new CronJob("15 * * * * *", function () {
		console.log("staring cron");
		giftService.thankyouCron();
	}, null, true, 'America/Los_Angeles');
} else {
	console.log("worker process");
	app.listen(3000);
	console.log("server start at port: 3000");
}
//app.listen(3000, function(){
//  console.log("server start at port: 3000");
//});