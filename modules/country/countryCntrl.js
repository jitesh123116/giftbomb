/*
 * @Author: Sachin kumar
 * @Date:   12/june/2017
 */

var Promise = require('bluebird');
var countryModel = require('./countryModel');
var suggestionModel = require('./countrySuggestionModel');
var STATUS = require('../statusCode');


var coutryCntrl = (function () {
	this.addCountry = function (country) {
		var promise = new Promise(function (resolve, reject) {
			countryModel.find({
				"name": country.name
			}, function (err, data) {
				if (err) {
					reject(STATUS("SC202", "", err));
				} else if (data.length > 0) {
					reject(STATUS("SC201", "Country name with code already exist", data[0]));
				} else {
					if (country.name && country.code) {
						var newCountry = new countryModel();
						newCountry.name = country.name.trim();
						if (country.code.indexOf('+') > -1) {
							newCountry.code = country.code.replace(/ +/g, "");
						} else {
							newCountry.code = "+" + country.code.replace(/ +/g, "");
						}
						newCountry.save(function (err, countryData) {
							if (err) {
								reject(STATUS("SC202", "", err));
							} else {
								resolve(STATUS("SC200", "Country added successfully", countryData));
							}
						})
					} else {
						reject(STATUS("SC201", "Country name and code is required"));
					}
				}
			})
		})
		return promise;
	}
	this.updateCountry = function (req) {
		var promise = new Promise(function (resolve, reject) {
			countryModel.find({
				"_id": req.params.id
			}, function (err, data) {
				if (err) {
					reject(STATUS("SC202", "", err));
				} else {
					var name = req.body.name ? req.body.name : data[0].name;
					var code;
					if (req.body.code) {
						if (req.body.code.indexOf('+') > -1) {
							code = req.body.code.replace(/ +/g, "");
						} else {
							code = "+" + req.body.code.replace(/ +/g, "");
						}
					} else {
						code = data[0].code;
					}
					countryModel.findOneAndUpdate({
						"_id": req.params.id
					}, {
						$set: {
							"name": name,
							"code": code
						}
					}, {
						new: true
					}, function (err, data) {
						if (err) {
							reject(STATUS("SC202", "", err));
						} else {
							resolve(STATUS("SC200", "Country updated successfully", data));
						}
					})
				}
			})
		})
		return promise;
	}
	this.getAllCountry = function (req) {

		var queryData = JSON.parse(req.query.query);
		console.log("queryData", queryData);
		var limit = (queryData.limit !== undefined) ? parseInt(queryData.limit) : 10;
		var skip = (queryData.page !== undefined) ? (limit * (queryData.page - 1)) : 0;

		var promise = new Promise(function (resolve, reject) {
			countryModel.find().limit(limit).skip(skip).exec(function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else {
					countryModel.count({}, function (err, c) {
						var Result = {
							rows: data,
							totalRows: c
						}
						resolve(STATUS("SC200", "Success", Result));
					});
				}
			})
		})
		return promise;
	}
	this.addSuggestion = function (suggestion) {
		var promise = new Promise(function (resolve, reject) {
			var suggObj = new suggestionModel();
			suggObj.name = suggestion.name;
			suggObj.email = suggestion.email.toLowerCase();
			suggObj.country = suggestion.country;
			suggObj.city = suggestion.city;
			suggObj.save(function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(STATUS("SC200", "New suggestion added", data));
				}
			})
		})
		return promise;
	}
	this.getSuggestion = function (suggestion) {
		var promise = new Promise(function (resolve, reject) {
			suggestionModel.find({}, function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(STATUS("SC200", "List of all suggestions", data));
				}
			})
		})
		return promise;
	}
	this.getAllCity = function (countryName) {
		var promise = new Promise(function (resolve, reject) {

			countryName = countryName.replace("%20", " ");
			console.log("countryName", countryName);
			countryModel.find({
				"code": countryName
			}, {
				"city": 1
			}, function (err, cityList) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (cityList.length > 0) {
					resolve(STATUS("SC200", "city list for " + countryName, cityList));
				} else {
					resolve(STATUS("SC200", "city list for " + countryName));
				}
			})
		})
		return promise;
	}
	this.addCity = function (req) {
		var promise = new Promise(function (resolve, reject) {
			countryModel.find({
				"name": {
					$regex: new RegExp("^" + req.body.countryName + "$", "i")
				}
			}, function (err, countryFound) {
				if (err) {
					reject(err);
				} else if (countryFound.length > 0) {
					if (countryFound[0].city.indexOf(req.body.cityName) > -1) {
						reject({
							"error": "City name already added"
						});
					} else {
						countryModel.update({
							"_id": countryFound[0]._id
						}, {
							$push: {
								"city": req.body.cityName
							}
						}, function (err, data) {
							if (err) {
								reject(err);
							} else {
								resolve(STATUS("SC200", "city added"));
							}
						})
					}
				} else {
					reject({
						"error": "country not found"
					});
				}
			})
		})
		return promise;
	}

	this.deleteCountry = function (id) {
		var promise = new Promise(function (resolve, reject) {
			countryModel.remove({
				"_id": id
			}, function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else {
					resolve(STATUS("SC200", "Country has been deleted successfully.", data));
				}
			})
		})
		return promise;
	}


	this.deleteCity = function (city) {
		var promise = new Promise(function (resolve, reject) {
			countryModel.update({
				"city": city
			}, {
				"$pull": {
					"city": city
				}
			}, function (err, data) {
				if (err) {
					console.log("errerr", err);
					resolve(STATUS("SC202", err));
				} else {
					console.log("data data", data);
					resolve(STATUS("SC200", "City has been deleted successfully.", data));
				}
			})
		})
		return promise;
	}

	/**
	 * 
	 */
	this.fetchCityList = function () {
		var promise = new Promise(function (resolve, reject) {
			countryModel.find({}, function (err, cityList) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else if (cityList.length > 0) {
					resolve(STATUS("SC200", "Success", cityList));
				} else {
					resolve(STATUS("SC202", "No data founds"));
				}
			})
		})
		return promise;
	}


	/**
	 * 
	 */
	this.getAllCities = function (req) {

		queryData = JSON.parse(req.query.query);
		var limit = (queryData.limit !== undefined) ? parseInt(queryData.limit) : 200;
		var skip = (queryData.page !== undefined) ? (limit * (queryData.page - 1)) : 0;
		var promise = new Promise(function (resolve, reject) {
			var aggregate = [];
			if (queryData.name !== undefined && queryData.name !== null && queryData.name !== 'null' && queryData.name) {

				var aggregate = [
					{
						$match: {
							"name": queryData.name
						}
					},
					{
						$unwind: "$city"
					},
					{
						"$skip": skip
					},
					{
						"$limit": limit
					},
					{
						$group: {
							_id: null,
							cities: {
								$push: "$city"
							}
						}
					},
					{
						$project: {
							_id: 0,
							city: "$cities"
						}
					}
            ]


			} else {
				var aggregate = [
					{
						$unwind: "$city"
					},
					{
						"$skip": skip
					},
					{
						"$limit": limit
					},
					{
						$group: {
							_id: null,
							cities: {
								$push: "$city"
							}
						}
					},
					{
						$project: {
							_id: 0,
							city: "$cities"
						}
					}
            ]
			}



			console.log("aggregate", aggregate);
			countryModel.aggregate(aggregate, function (err, data) {
				if (err) {
					resolve(STATUS("SC200", err));
				} else {

					if (queryData.name !== undefined && queryData.name !== null && queryData.name !== 'null' && queryData.name) {
						var aggregate = [
							{
								$match: {
									"name": queryData.name
								}
							},
							{
								$unwind: "$city"
							},
							{
								$group: {
									_id: "$_id",
									'sum': {
										'$sum': 1
									}
								}
							},
							{
								$group: {
									_id: null,
									'total_sum': {
										'$sum': '$sum'
									}
								}
							}
                ]
					} else {
						var aggregate = [
							{
								$unwind: "$city"
							},
							{
								$group: {
									_id: "$_id",
									'sum': {
										'$sum': 1
									}
								}
							},
							{
								$group: {
									_id: null,
									'total_sum': {
										'$sum': '$sum'
									}
								}
							}
                ]

					}
					countryModel.aggregate(aggregate, function (err, totalRows) {
						if (err) {
							resolve(STATUS("SC200", err));
						} else {
							var result = {
								'rows': data,
								'totalRows': totalRows
							};
							resolve(STATUS("SC200", "Success", result));
						}
					})
				}
			})
		})
		return promise;
	}


	/**
	 * 
	 * @param {type} req
	 * @returns {countryCntrl_L11.getAllCountry.promise}
	 */
	this.getAllCountryData = function (req) {

		var promise = new Promise(function (resolve, reject) {
			countryModel.find({}, function (err, data) {
				if (err) {
					resolve(STATUS("SC202", err));
				} else {
					resolve(STATUS("SC200", "Success", data));
				}
			})
		})
		return promise;
	}


	this.fetchCountryRecord = (req) => {
		var count;
		var doc = {};



		var req = JSON.parse(req.query.query);
		var limit = parseInt(req.limit);
		var skip = (limit * (req.page - 1));
		var promise = new Promise((resolve, reject) => {
			var query = {};
			suggestionModel.find({}, (err, info) => {
				if (err) {
					resolve(STATUS("SC202", err));
				}
				count = info.length;
				doc.count = count;
				suggestionModel.find(query).sort({
					"_id": -1
				}).limit(limit).skip(skip).exec((err, data) => {
					if (err) {
						resolve(STATUS("SC202", err));
					} else {
						doc.data = data;

						resolve(STATUS("SC200", "success", doc));
					}
				})

			})


		})
		return promise;
	}





	return this;
}());

module.exports = coutryCntrl;