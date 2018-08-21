/*
 * @Author: Sachin kumar
 * @Date:   12/june/2017
 */

var Promise = require('bluebird');
var FLModel = require('./featuredListModel');
var STATUS = require('../statusCode');

var FLCntrl = (function(){
	this.addFeaturedList = function(req){
		var promise = new Promise(function(resolve, reject){
			if(!req.body.listName && !req.body.city && !req.body.listItem){
				reject(STATUS("SC202","Field missing."));
			}else{
				FLModel.find({"listName":req.body.listName,"city":req.body.city}, function(err, found){
					if(err){
						reject(STATUS("SC202","",err));
					}else if(found.length > 0){
						reject(STATUS("SC202","List with same name in same city already exist."));
					}else{
						var list = new FLModel();
						list.listName = req.body.listName;
						list.city = req.body.city;
						list.listItem = req.body.listItem;
						list.endDate = req.body.endDate;
						list.startDate = req.body.startDate;
						list.save(function(err, data){
							if(err){
								reject(STATUS("SC202","",err));
							}else{
								resolve(STATUS("SC200","new featured list created",data));
							}
						})
					}
				})
			}			
		})
		return promise;
	}
	this.getFeaturedListApi = function(params){
		var promise = new Promise(function(resolve, reject){
			var query = {};
			if(params && params.city){
				if(params.city == 'all'){
					query = {};
				}else{
					query.city = params.city;
				}				
			}
			FLModel.find(query).populate('listItem').exec(function(err, data){
				if(err){
					reject(STATUS("SC202","",err));
				}else{	
					resolve(STATUS("SC200","get all featured list",data));			
				}
			})
		})
		return promise;
	}
	this.getFeaturedListById = function(params){
          var promise = new Promise(function(resolve, reject){
            if(params && params.id){
              FLModel.find({"_id":params.id}).populate({path:'listItem',populate:{path:'storeId'}}).exec(function(err, data){
                      if(err){
                              reject(STATUS("SC202","",err));
                      }else{	
                              resolve(STATUS("SC200","get featured list by id",data));			
                      }
              })
            }
          })
          return promise;
	}
        /**
         * 
         * @param {type} req
         * @returns {featuredListCntrl_L10.updateFeaturedList.promise}
         */
	this.updateFeaturedList = function(req){
          
          var promise = new Promise(function(resolve, reject){            
            if(!req.body.listName || !req.body.city || !req.body.listItem){
              resolve(STATUS("SC202","Field missing."));
            }else{
              FLModel.find({listName:req.body.listName,city:req.body.city,_id: {$ne:req.body._id} }, function(err, found){
                if(err){
                  resolve(STATUS("SC202",err));
                }else if(found.length > 0){
                  resolve(STATUS("SC202","List with same name in same city already exist."));
                }else{
                  FLModel.findOneAndUpdate({"_id":req.body._id}, {$set:{"listItem":req.body.listItem,listName:req.body.listName,city:req.body.city,startDate:req.body.startDate,endDate:req.body.endDate }},{new:true},function(err, updated){
                    if(err){
                      resolve(STATUS("SC202",err));
                    }else{
                      resolve(STATUS("SC200","List updated successfully",updated));
                    }
                  })
                }
              })
            }			
          })
          return promise;
	}
        
        
        /**
         *@Find distinct cities 
         */
        this.fetchDistinctFeaturedCities = function(req){
          var promise = new Promise(function(resolve, reject){                     
            FLModel.distinct("city", function(err, found){
              if(err){
                resolve(STATUS("SC202",err));
              }else {
                console.log("found",found);
                resolve(STATUS("SC200","Success",found));
              }
            })						
          })
          return promise;
	}
        
        /**
         * 
         */
        this.getFeaturedListData = function(req){
          console.log("getFeaturedList",req);         
          var limit = (req.limit!==undefined) ?  parseInt(req.limit) :10;
          var skip = (req.page!==undefined) ?  (limit * (req.page-1))  :0;             
          var promise = new Promise(function(resolve, reject){
            var query = {};
            if(req.city!==undefined && req.city){
              if(req.city == 'all'){
                query = {};
              }else{
                query.city = req.city;
              }				
            }
            FLModel.find(query).sort({'_id':-1}).limit(limit).skip(skip).populate('listItem').exec(function(err, data){
              if(err){
                resolve(STATUS("SC202",err));	
              }else{	
                FLModel.count(query,function(err,c){
                  var Result = {
                    rows : data,
                    totalRows : c
                  }                  
                  resolve(STATUS("SC200","Success",Result));
                });                   		
              }
            })
          })
          return promise;
	}
        
        /**
         *@fetchFeaturedData 
         */
        this.fetchFeaturedData = function(req){
          var limit = (req.limit!==undefined) ?  parseInt(req.limit) :10;
          var skip = (req.page!==undefined) ?  (limit * (req.page-1))  :0;   
          
          var promise = new Promise(function(resolve, reject){
            var mongoose = require('mongoose');
            var objectId = mongoose.Types.ObjectId(req.id);
            //console.log("objectId",objectId);
            var aggregate = [
              {$match: { "_id": objectId } },
              {$unwind: "$listItem"},
              {$lookup: {
              "from" : "branches",
              "localField" : "listItem",
              "foreignField" : "_id",
              "as" : "branches"
              } },
              {$unwind: "$branches" },
              {$lookup: {
              "from" : "stores",
              "localField" : "branches.storeId",
              "foreignField" : "_id",
              "as" : "stores_data"
              } },            
              { "$skip": skip },	
              { "$limit": limit }
            ]
            //console.log("aggregate",aggregate);            
            FLModel.aggregate(aggregate,function(err, data){           
              if(err){
                resolve(STATUS("SC202",err));
              }else{                
                var aggregate = [
                  {$match: { "_id": objectId } },
                  {$unwind:"$listItem"},
                  {$group:{_id:"$_id", 'sum': {'$sum':1 }  }},
                  {$group:{_id:null, 'total_sum': {'$sum': '$sum' }  }}
                ]

                FLModel.aggregate(aggregate,function(err, totalRows){
                  if(err){
                    resolve(STATUS("SC200",err));
                  }else{
                    var result = {
                      'rows' :data,
                      'totalRows' : totalRows[0].total_sum
                    };
                    resolve(STATUS("SC200", "Success", result));
                  }                
                })
              }
            })            
          })
          return promise;
	}
        
        
	return this;
}());

module.exports = FLCntrl;
