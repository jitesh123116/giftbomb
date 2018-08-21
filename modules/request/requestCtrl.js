/*
 * @Author: Vinay kumar
 * @Date:   10/july/2017
 */

var Promise = require('bluebird');
var requestModel = require('./requestModel');
var STATUS = require('../statusCode');
var async = require('async');
var branchModel = require('../store/branchModel');

var requstCtrl = (function(){

/**
 *@addRequestForData  
 */  
this.addRequestForData = function(req){    

  var postData = req.body;
  if(req.body.params!==undefined && req.body.params){
     var postData = JSON.parse(req.body.params);
  } 
  var promise = new Promise(function(resolve, reject){
    if(!postData.storeId){
            reject({"error":"storeId missing"});
    }else if(!postData.requestType){
            reject({"error":"requestType missing"});
    }else if(!postData.updateData){
            reject({"error":"updateData missing"});
    }else{
       if(postData["updateData"]["branch"]!==undefined && postData["updateData"]["branch"]["locationName"]!==undefined){

           var locationName = postData["updateData"]["branch"]["locationName"];
            var branchId = postData["branchId"];
            var storeId = postData["storeId"];
            branchModel.find({"locationName":locationName,storeId:storeId ,_id: { $ne: branchId } }, function(err, data){
              if(err){
                resolve(STATUS("SC202",err));
              }else if(data.length>0){
                resolve(STATUS("SC202","This location name is already exist with this store."));
              }else{
                var myData = new requestModel(postData);
                myData.save(postData,function(err, requestData){
                  if(err){
                    resolve(STATUS("SC202",err));
                  }else{
                    resolve(STATUS("SC200","Request has been added successfully",requestData));
                  }
                })
              }
            })           
       }else{        

        if(req.file!==undefined && req.file.filename!==undefined && req.file.filename && postData["updateData"]["accountInfo"]!==undefined){
          postData["updateData"]["accountInfo"]["storeThumbnail"] = req.file.filename;

        }else if(req.file!==undefined && req.file.filename!==undefined && req.file.filename && postData["updateData"]["designInfo"]!==undefined){
          postData["updateData"]["designInfo"]["storeLogo"] = req.file.filename;
        }

				 
				  	if (postData["requestType"] == "promotionInfo") {
									var obj = {};
									obj['promotionInfo'] = JSON.parse(postData["updateData"]);
									obj["promotionInfo"]["promotionLogo"]=req.file.filename;
									postData["updateData"] = obj;
									postData.promotionLogo = req.file.filename;
									}
        var myData = new requestModel(postData);
        myData.save(postData,function(err, requestData){
          if(err){
            resolve(STATUS("SC202",err));
          }else{
            resolve(STATUS("SC200","Request has been added successfully",requestData));
          }
        })
      }  
    }
  })
  return promise;
}
        
/**
 *@getBranchWithId   
 */
this.getBranchWithId = function(id,cb){    
  if(id){      
    branchModel.find({"_id":id}, function(err, data){
      if(err){           
        return cb(err,null);   
      }else{           
        return cb(null,data);            
      }
    })
  }
}
  
  
/**
 *@getRequestForData
 */  
this.getRequestForData = function(req){          
  var branchResult=[];
  var promise = new Promise(function(resolve, reject){
    var query = {};
    if(req.params && req.params.id){ //'branchId'
      query._id = req.params.id;
    }
    requestModel.find(query).populate('storeId').populate('branchId').exec(function(err, reqest){
      if(err){
        resolve(STATUS("SC202",err));
      }else if(reqest.length > 0){        

        /*if(reqest[0].updateData.branch!==undefined){                  
          async.eachSeries(reqest[0].updateData.branch,function(item, cb){              
              if(Object.keys(item).length >1){
                getBranchWithId(item._id, function(err,data){                                        
                  if(data && data.length>0){                    
                    branchResult.push(data[0]);
                    return cb();
                  }
                })
              }                
          }, function(err){
            var result ={
              request : reqest,
              branch : branchResult
            }                        
            resolve(STATUS("SC200", "get request successfully",result));
          })  
        }else{
          var result ={
            request : reqest,
            branch : branchResult
          }                        
          resolve(STATUS("SC200", "get request successfully",result));
        }
        */
        resolve(STATUS("SC200", "get request successfully",reqest));
      }else{
        resolve(STATUS("SC202","No reqest found"));
      }
    })
  })
  return promise;
}       
        
        
/**
 *@getRequestOfTypeData
 */	
this.getRequestOfTypeData = function(req){         
  var promise = new Promise(function(resolve, reject){
    var query = {};
    if(req.params.type != 'all'){
      query.requestType = req.params.type;
    }            
    var limit = (req.params.limit!==undefined) ?  parseInt(req.params.limit) :10;
    var skip = (req.params.page!==undefined) ?  (limit * (req.params.page-1))  :0;
    query.status = (req.params.status!==undefined) ?  req.params.status  :0;

    requestModel.find(query).limit(limit).skip(skip).populate('storeId').exec(function(err, reqest){              
      if(err){
        resolve(STATUS("SC202","",err));
      }else if(reqest.length > 0){
        requestModel.count(query,function(err,c){
          var Result = {
            rows : reqest,
            totalRows : c
          }                  
          resolve(STATUS("SC200","Success",Result));
        });
      }else{
        resolve(STATUS("SC202","No reqest found"));
      }
    })
  })
  return promise;
}
        
  
  
/**
 *@saveRequest
 */    
this.saveRequest = function(req){
  var promise = new Promise(function(resolve, reject){
    var newRequest = new requestModel();
    newRequest.storeId = req.body.storeId ? req.body.storeId : 0;
    newRequest.requestType = req.body.requestType ? req.body.requestType : '';            
    newRequest.updateData = req.body.updateData ? req.body.updateData : [];
    newRequest.save(function(err, requestData){
      if(err){
              reject(STATUS("SC202","",err));
      }else{
              resolve(STATUS("SC200","New Request added",requestData));
      }
    })
  })
  return promise;
}

/**
 *@fetchDataForRequest 
 */   
this.fetchDataForRequest = function(where){    
  // console.log("fetchData controller",where);
  var promise = new Promise(function(resolve, reject){			
    requestModel.find(where, function(err, data){
      if(err){
     //   console.log("1",where);
        resolve(STATUS("SC202",err));
      }else if(data.length > 0){
      //  console.log("2",where);
        resolve(STATUS("SC200","Success",data));
      }else{
        // console.log("3",where);
        resolve(STATUS("SC202","No data founds"));
      }
    })
  })
  return promise;
  }
        
/**
 *@updateDataForRequest 
 */        
this.updateDataForRequest = function(req){ 

  var where = req.body.where;
  var column = req.body.column;
  if(req.body.stringify!==undefined && req.body.stringify==1){
    where = JSON.parse(req.body.where);
    column = JSON.parse(req.body.column);
  }          
  if(req.file!==undefined && req.file.filename!==undefined && req.file.filename && column["$set"]!==undefined && column["$set"]["updateData.accountInfo"]!==undefined){
    column["$set"]["updateData.accountInfo"]["storeThumbnail"] = req.file.filename;

  }else if(req.file!==undefined && req.file.filename!==undefined && req.file.filename && column["$set"]!==undefined && column["$set"]["updateData.designInfo"]!==undefined){
    column["$set"]["updateData.designInfo"]["storeLogo"] = req.file.filename;
  }

  var promise = new Promise(function(resolve, reject){	            
    requestModel.update(where,column, function(err, data){
      //console.log(err);
      if(err){
        reject(err);
      }else{
        resolve(STATUS("SC200","Record updated successfully",data));
      }
    })
  })
  return promise;
}
        
        
/**
 *@updateLocationRequest 
 */
this.updateLocationRequest = function(where,column){ 

  var promise = new Promise(function(resolve, reject){            
    if(column["$set"]!==undefined && column["$set"]["updateData.branch"]!==undefined && column["$set"]["updateData.branch"].locationName!==undefined){

      var locationName = column["$set"]["updateData.branch"].locationName;
      var branchId = where["branchId"];
      var storeId = where["storeId"];
      branchModel.find({"locationName":locationName,storeId:storeId ,_id: { $ne: branchId } }, function(err, data){
        if(err){
          resolve(STATUS("SC202",err));
        }else if(data.length>0){
          resolve(STATUS("SC202","This location name is already exist with this store."));
        }else{
          requestModel.update(where,column, function(err, data){              
            if(err){
              resolve(STATUS("SC202",err));
            }else{
              resolve(STATUS("SC200","Record updated successfully",data));
            }
          })
        }
      })
    }else{
      requestModel.update(where,column, function(err, data){              
        if(err){
          resolve(STATUS("SC202",err));
        }else{
          resolve(STATUS("SC200","Record updated successfully",data));
        }
      })
    }
  })
  return promise;
}
        
        
/**
 *@removeLocationRequest 
 */
this.removeLocationRequest = function(where,type){ 
  var promise = new Promise(function(resolve, reject){ 

    if(type=='designInfo' || type=='locationInfo'){
      requestModel.remove(where,function(err, data){              
        if(err){
          resolve(STATUS("SC202",err));
        }else{
          resolve(STATUS("SC200","Request saved successfully",data));
        }
      })
    }else if(type=='accountInfo'){
      requestModel.find(where, function(err, data){                
        if(err){
          resolve(STATUS("SC202",err));
        }else if(data.length>0){
          if(data[0].updateData.contactInfo===undefined){

            requestModel.remove(where,function(err, data){              
              if(err){
                resolve(STATUS("SC202",err));
              }else{
                resolve(STATUS("SC200","Record saved successfully",data));
              }
            });                    
          }else{

            var column = { $set : { updateData : { 'contactInfo' : data[0].updateData.contactInfo}}};

            requestModel.update(where,column, function(err, data){              
            if(err){
              resolve(STATUS("SC202",err));
            }else{
              resolve(STATUS("SC200","Record updated successfully",data));
            }
          })

          resolve(STATUS("SC200","Record updated successfully",data));
        }

       }
      })
    }else if(type=='contactInfo'){
      requestModel.find(where, function(err, data){                
        if(err){
          resolve(STATUS("SC202",err));
        }else if(data.length>0){
          if(data[0].updateData.contactInfo===undefined){

            requestModel.remove(where,function(err, data){              
              if(err){
                resolve(STATUS("SC202",err));
              }else{
                resolve(STATUS("SC200","Record saved successfully",data));
              }
            });                    
          }else{

            var column = { $set : { updateData : { 'accountInfo' : data[0].updateData.accountInfo}}};

            requestModel.update(where,column, function(err, data){              
            if(err){
              resolve(STATUS("SC202",err));
            }else{
              resolve(STATUS("SC200","Record updated successfully",data));
            }
          })

          resolve(STATUS("SC200","Record updated successfully",data));
        }

       }
      })
    }
  })
  return promise;
}
return this;

}());
module.exports = requstCtrl;
