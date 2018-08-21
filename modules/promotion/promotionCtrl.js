/*
 * @Author: Vinay kumar
 * @Date:   10/july/2017
 */

var Promise = require('bluebird');
var promotionModel = require('./promotionModel');
var STATUS = require('../statusCode');
var serverConstants = require('../serverConstants');
var dateFormat = require('dateformat');
var fs = require('fs');
var path = require('path');
var async= require("async");
var requstCtrl = (function () {

	/**
	 *@addPromotionRequest is used to save data into  promotions collection 
	 */
	this.addPromotionRequest = function (req) {
		var errorMessage = "";
		var promise = new Promise(function (resolve, reject) {

			var promotionName = (req.body.promotionName !== undefined) ? req.body.promotionName.trim() : '';
			var originalValue = (req.body.originalValue !== undefined) ? req.body.originalValue : '';
			var offerValue = (req.body.offerValue !== undefined) ? req.body.offerValue : '';
			var startDate = (req.body.startDate !== undefined) ? req.body.startDate : '';
			var endDate = (req.body.endDate !== undefined) ? req.body.endDate : '';

			if (!promotionName || !originalValue || !offerValue || !startDate) {
				errorMessage = "Required params are missing.";
				resolve(STATUS("SC202", errorMessage));
			} else {
				var newRequest = new promotionModel();
				newRequest.storeId = req.body.storeId;
				newRequest.promotionName = promotionName;
				newRequest.originalValue = originalValue;
				newRequest.offerValue = offerValue;
				newRequest.startDate = startDate;
				newRequest.endDate = endDate;
				newRequest.promotionLogo = req.body.promotionLogo;
				newRequest.save(function (err, requestData) {
					if (err) {
						resolve(STATUS("SC202", err));
					} else {
						resolve(STATUS("SC200", "success", requestData));
					}
				})
			}
		})
		return promise;
	}

	/**
	 *@fetchPromotionRequest is used to fetch data from  promotions collection 
	 */
	this.fetchPromotionRequest = function (req) {

		var promise = new Promise(function (resolve, reject) {

			var query = {};
			var limit = (req.params.limit !== undefined) ? parseInt(req.params.limit) : 10;
			var skip = (req.params.page !== undefined) ? (limit * (req.params.page - 1)) : 0;

			promotionModel.find(query).limit(limit).skip(skip).populate('storeId').exec(function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (data.length > 0) {
					promotionModel.count(query, function (err, c) {
						var Result = {
							rows: data,
							totalRows: c
						}
						resolve(STATUS("SC200", "Success", Result));
					});
				} else {
					resolve(STATUS("SC202", "No data founds"));
				}
			})
		});
		return promise;
	}

	/**  
	 *@createExcelFile is used to create excel file 
	 */
	this.createExcelFileForPromotions = function (req) {
		var query = {};
		var promise = new Promise(function (resolve, reject) {
			promotionModel.find(query, function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (data.length > 0) {
					var str = "PROMOTION ID" + "," + "START DATE" + "," + "END DATE" + "," + "PROMOTION NAME" + "," + "ACTUAL VALUE" + "," + "OFFER VALUE" + "," + "CARD SOLD" + "," + "REVENUE EARNED" + "\n";
					for (var i = 0; i < data.length; i++) {

						var promotionId = (data[i].promotionId !== undefined) ? data[i].promotionId : '';
						var endDate = (data[i].endDate !== undefined && data[i].endDate) ? dateFormat(data[i].endDate, "mm/d/yyyy") : '';
						var startDate = (data[i].startDate !== undefined && data[i].startDate) ? dateFormat(data[i].startDate, "mm/d/yyyy") : '';
						var offerValue = (data[i].offerValue !== undefined) ? data[i].offerValue : '';
						var originalValue = (data[i].originalValue !== undefined) ? data[i].originalValue : '';
						var promotionName = (data[i].promotionName !== undefined) ? data[i].promotionName : '';
						var cardSold = '';
						var revenueEarned = '';

						str += promotionId + "," + startDate + "," + endDate + "," + promotionName + "," + originalValue + "," + offerValue + "," + cardSold + "," + revenueEarned + "\n";
					}
					var output = path.resolve(serverConstants.url.DOCUMENT_ROOT_UPLOAD + "promotions.xlsx");
					fs.writeFile(output, str, function (err) {
						if (err) {
							resolve(STATUS("SC202", err));
						} else {
							resolve(STATUS("SC200", "Success", data));
						}
					});
				} else {
					resolve(STATUS("SC202", "No data founds"));
				}
			})
		})
		return promise;
	}

	this.getList = function (payload, callback) {
		var promotions=[];
		async.series([

			(cb) => {

				var query = {};
				var limit = (payload.limit !== undefined) ? parseInt(payload.limit) : 10;
				var skip = (payload.page !== undefined) ? (limit * (payload.page - 1)) : 0;
				var path = 'storeId';
				var select = 'accountInfo'
				var populate = {
					path: path,
					match: {},
					select: select,
					options: {
						lean: true
					}
				};
				var options = {
					lean: true
				};
			  var projection={
					storeId:1,
					promotionId:1,
					promotionName:1,
					originalValue:1,
					offerValue:1,
					startDate:1,
					endDate:1,
					promotionCouponCount:1,
					promotionCouponUsed:1
				}
				if(payload.startDate){
					query.startDate={$lte:payload.startDate}
				}
				if(payload.endDate){
					query.endDate={$gte:payload.endDate}
				}
				
				if(payload.storeName){
					populate["match"]["accountInfo"]["storeName"] = payload["storeName"];
				}

				
				promotionModel.find(query).select(projection).limit(limit).skip(skip).populate(populate).exec((err,list)=>{
					if(!err){
						if(list.length>0){
							for(var i=0; i<list.length;i++){
								promotions.push({
									promotionId: list[i]["promotionId"],
									promotionName:list[i]["promotionName"],
									storeName:list[i]["storeId"]["accountInfo"]["storeName"],
									category: list[i]["storeId"]["accountInfo"]["category"],
									actualValue:list[i]["originalValue"],
									offerValue:list[i]["offerValue"],
									startDate:list[i]["startDate"],
									endDate:list[i]["endDate"],
									totalCoupons:list[i]["promotionCouponCount"],
									cardSolds:list[i]["promotionCouponUsed"]
								});
								
							}
							cb(null);
						}
					}else{
					cb(null);	
					}
				});

			}
		],(err,data)=>{
			if(!err){
				callback(null, STATUS("SC202", "Promotion List",promotions));
			}else{
				callback(STATUS("SC202", err));
			}
		})
	}


	return this;
}());
module.exports = requstCtrl;