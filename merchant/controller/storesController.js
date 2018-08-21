app.controller('storesController', function($scope,constantUrl, servercalls,$state,$rootScope,toastr,$window){ 
  //check user login session
  (function(){
    if(!$window.localStorage.getItem('id')){
        $state.go('login');
    }
  })();
    
  $scope.store = {};
  $scope.cityFilter = [];
  $scope.countryList = [];
  $scope.branchId;
  $scope.showBranch = false;
  $scope.locationFilter = [];
  $scope.filterLocation = "";
  $scope.cityList =[];
  $scope.storeImage ="";
  /**
   * 
   * @returns {undefined}
   */
  $scope.$on('$viewContentLoaded', function() {    
    $scope.fetchStore();
    $scope.getCoutryList();
  });
  
  /**
   *@fetchStore for fetching the store data  
   */ 
  $scope.fetchStore = function(){   
    
      var id = $window.localStorage.getItem('id');        
      servercalls.getData('/store/single/'+id,{}, function(err, data){        
        if(err){                      
          toastr.error("Something is wrong, please try after some time");
        }else{          
          if(data.status.status == 200){
            console.log("data.data[0].branch[0].city",data.data.branch[0].city);
            $scope.store = data.data;
            //$scope.branchId = data.data.branch[0].branchId;
            $scope.filterCity = data.data.branch[0].city;
            data.data.branch.forEach(function(item){
                    $scope.cityFilter.push(item.city);
            })            
            $scope.filterLocation = data.data.branch[0].locationName; 
            data.data.branch.forEach(function(item){
              $scope.locationFilter.push(item.locationName);
            })
            
            
            toastr.success(data.status.message);                              
          }else{
            toastr.error(data.status.message);
          }				
        }
      })
  }
    

/**
 *@getFilterBranch for showing the branch  
 */  
$scope.getFilterBranch = function(){  
    $scope.store.branch = [];
    servercalls.getData('/store/branch/location/'+$scope.store._id+"/"+$scope.filterLocation, {}, function(err, data){
      if(data.status.status == 200){
        $scope.store.branch = data.data;        
        $scope.showBranch = true;
      }
    })
}   
 
 
  /**
   * 
   * @fetchBranchData for edit
   */
  $scope.fetchBranchData = function(){
    servercalls.getData('/store/branch/location/'+$scope.store._id+"/"+$scope.filterLocation, {}, function(err, data){
      if(data.status.status == 200){
        $scope.storeUpdateData = data.data[0];
        $scope.storeUpdateData.phoneNumber = parseInt(data.data[0].phoneNumber);
        $scope.branchId = data.data[0]._id;        
      }
    })    
  }
  
  /**  
   *@getCoutryList
   */
  $scope.getCoutryList = function(){
    servercalls.getData('/country', {}, function(err,data){
      if(data.status.status == 200){
        data.data.forEach(function(item){
          $scope.countryList.push(item.name);
        })
      }
    })
  }
  
  /**
   *@getCityList    
   */
  $scope.getCityList = function(){
    servercalls.getData('/country/fetchCityList', {}, function(err,data){
      if(data.status.status == 200){
        data.data.forEach(function(item){          
          item.city.forEach(function(cityName){          
            $scope.cityList.push(cityName);
          })
        })
      }
    })
  }
  $scope.getCityList();      
  
  
  
  $scope.setUpdateColumns = function(postData, data, storeData){
    var postArray = {};
    if(postData=='accountInfo'){            
      if(data.accountInfo.category!=storeData.category){
        postArray['category'] =storeData.category;
      }
      if(data.accountInfo.country!=storeData.country){
        postArray['country'] =storeData.country;
      }     
      if(data.accountInfo.storeName!=storeData.storeName){
        postArray['storeName'] =storeData.storeName;
      }
      if(data.accountInfo.tagLine!=storeData.tagLine){
        postArray['tagLine'] =storeData.tagLine;
      }
      if(data.accountInfo.website!=storeData.website){
        postArray['website'] =storeData.website;
      }
    } else if(postData=='contactInfo'){            
      if(data.contactInfo.firstName!=storeData.firstName){
        postArray['firstName'] =storeData.firstName;
      }
      if(data.contactInfo.lastName!=storeData.lastName){
        postArray['lastName'] =storeData.lastName;
      }
      if(data.contactInfo.contactNumber!=storeData.contactNumber){
        postArray['contactNumber'] =storeData.contactNumber;
      }
      if(data.contactInfo.email!=storeData.email){
        postArray['email'] =storeData.email;
      }      
    }else if(postData=='branchInfo'){  
      
      if(data.locationName!=storeData.locationName){
        postArray['locationName'] =storeData.locationName;
      }
      if(data.phoneNumber!=storeData.phoneNumber){
        postArray['phoneNumber'] =storeData.phoneNumber;
      }      
      if(data.state!=storeData.state){
        postArray['state'] =storeData.state;
      }      
      if(data.city!=storeData.city){
        postArray['city'] =storeData.city;
      }
      if(data.pincode!=storeData.pincode){
        postArray['pincode'] =storeData.pincode;
      }
      if(data.address!=storeData.address){
        postArray['address'] =storeData.address;
      }
      if(data.lat!=storeData.lat){
        postArray['lat'] =storeData.lat;
      }
      if(data.lon!=storeData.lon){
        postArray['lon'] =storeData.lon;
      }
    }
    
    return postArray;
  }
  
  
  /**
  *@updateBranchInfo  
  */
  $scope.updateBranchInfo = function(){
    
    var pushData = {};    
    self.oldBranchData =  $scope.store.branch[0]; 
    
    if(self.oldBranchData){        
      pushData = $scope.setUpdateColumns('branchInfo', self.oldBranchData, $scope.storeUpdateData);
      var where = {
        storeId : $window.localStorage.getItem('id'),
        requestType : "locationInfo",
        branchId : self.oldBranchData._id        
      }
      if(Object.keys(pushData).length >0){          
        servercalls.postData('/request/fetch',where, function(err, data){           
          if(data.status.status == 200 && data.data.length>0){            
            if(pushData.phoneNumber!==undefined && pushData.phoneNumber){
              pushData.phoneNumber = pushData.phoneNumber.toString();
            }
            var params = {};
            params['column'] = { $set: {  'updateData.branch'  : pushData } };            
            params['where'] = where;
            servercalls.postData('/request/updateLocationRequest',params, function(err, data){                
              if(err){                      
                toastr.error("Something is wrong, please try after some time");
              }else{          
                if(data.status.status == 200){
                  toastr.success(data.status.message);                      
                  $('#branch_info').modal('hide')
                }else{
                  toastr.error(data.status.message);
                }				
              }
            })
          } else{
            //pushData['_id'] = self.oldBranchData._id;
            var params = {
              branchId : self.oldBranchData._id,
              storeId : $window.localStorage.getItem('id'),
              requestType : 'locationInfo',            
              updateData : { 'branch' : pushData}
            }
            servercalls.postData('/request/',params, function(err, data){                
              if(err){                      
                toastr.error("Something is wrong, please try after some time");
              }else{          
                if(data.status.status == 200){
                  toastr.success(data.status.message);                     
                  $('#branch_info').modal('hide')
                }else{
                  toastr.error(data.status.message);
                }				
              }
            })
          }            
        }); 
      }else{
        var params = {
          where :where,
          type: 'locationInfo'
        }
        servercalls.postData('/request/removeLocationRequest/',params, function(err, data){                
            if(err){                      
              toastr.error("Something is wrong, please try after some time");
            }else{          
              if(data.status.status == 200){
                toastr.success(data.status.message);                     
                $('#branch_info').modal('hide')
              }else{
                toastr.error(data.status.message);
              }				
            }
        })
      }
    }
    
  }  
  
  
  /**
  *@updateContactInfo  
  */
  $scope.updateContactInfo = function(){
    // find store details
    var pushData = {};      
    var where = {
      _id : $window.localStorage.getItem('id')          
    };
    servercalls.postData('/store/fetch',where, function(err, data){
      if(data.status.status == 200){        
        pushData = $scope.setUpdateColumns('contactInfo', data.data[0], $scope.storeUpdateData);
        var where = {
          storeId : $window.localStorage.getItem('id'),
          "requestType" : "storeInfo" 
        }
        if(Object.keys(pushData).length >0){          
          servercalls.postData('/request/fetch',where, function(err, data){           
            if(data.status.status == 200 && data.data.length>0){              
              if(pushData.contactNumber!==undefined && pushData.contactNumber){
                pushData.contactNumber = pushData.contactNumber.toString();
              }
              var params = {};
              params['column'] = { $set: {  'updateData.contactInfo'  : pushData } };            
              params['where'] = where;              
              servercalls.postData('/request/updateData',params, function(err, data){                
                if(err){                      
                  toastr.error("Something is wrong, please try after some time");
                }else{          
                  if(data.status.status == 200){
                    toastr.success(data.status.message);                      
                    $('#contact_details').modal('hide')
                  }else{
                    toastr.error(data.status.message);
                  }				
                }
              })
            } else{
              var params = {
                storeId : $window.localStorage.getItem('id'),
                requestType : 'storeInfo',
                updateData : { 'contactInfo' : pushData}
              }               
              servercalls.postData('/request/',params, function(err, data){                
                if(err){                      
                  toastr.error("Something is wrong, please try after some time");
                }else{          
                  if(data.status.status == 200){
                    toastr.success(data.status.message);                     
                    $('#contact_details').modal('hide')
                  }else{
                    toastr.error(data.status.message);
                  }				
                }
              })
            }            
          }); 
        }else{
          var params = {
            where :where,
            type: 'contactInfo'
          }
          servercalls.postData('/request/removeLocationRequest/',params, function(err, data){                
              if(err){                      
                toastr.error("Something is wrong, please try after some time");
              }else{          
                if(data.status.status == 200){
                  toastr.success(data.status.message);                     
                  $('#accountInfo').modal('hide')
                }else{
                  toastr.error(data.status.message);
                }				
              }
          })
        }
      }
    });
  }  
  
  /**
   *@updateAccountInfo   
   */
  $scope.updateAccountInfo = function(){
    // find store details
    var pushData = {};    
    var where = {
      _id : $window.localStorage.getItem('id')          
    };
    servercalls.postData('/store/fetch',where, function(err, data){
      if(data.status.status == 200){        
        pushData = $scope.setUpdateColumns('accountInfo', data.data[0], $scope.storeUpdateData);
        var where = {
          storeId : $window.localStorage.getItem('id'),
          "requestType" : "storeInfo" 
        }
        if(Object.keys(pushData).length >0 || $scope.storeImage){          
          servercalls.postData('/request/fetch',where, function(err, data){           
            if(data.status.status == 200 && data.data.length>0){
              var params = {};
              params['column'] = { $set: {  'updateData.accountInfo'  : pushData } };            
              params['where'] = where;       
              
              var payload = new FormData();
              payload.append('storeImage', $scope.storeImage);            
              payload.append('column', JSON.stringify({ $set: {  'updateData.accountInfo'  : pushData } }));
              payload.append('where', JSON.stringify(where));
              payload.append('stringify', 1);
              
              servercalls.editRequest('/request/updateData', payload, function(err, data){
              //servercalls.postData('/request/updateData',params, function(err, data){                
                if(err){                      
                  toastr.error("Something is wrong, please try after some time");
                }else{          
                  if(data.status.status == 200){
                    toastr.success(data.status.message);                      
                    $('#accountInfo').modal('hide')
                  }else{
                    toastr.error(data.status.message);
                  }				
                }
              })
            } else{
              var params = {
                storeId : $window.localStorage.getItem('id'),
                requestType : 'storeInfo',
                updateData : { 'accountInfo' : pushData}
              }              
              var payload = new FormData();
              payload.append('storeImage', $scope.storeImage);            
              payload.append('params', JSON.stringify(params));
              console.log("params");
              console.log(params);
              servercalls.createRequest('/request/', payload, function(err, data){
              
              //servercalls.postData('/request/',params, function(err, data){                
                if(err){                      
                  toastr.error("Something is wrong, please try after some time");
                }else{          
                  if(data.status.status == 200){
                    toastr.success(data.status.message);                     
                    $('#accountInfo').modal('hide')
                  }else{
                    toastr.error(data.status.message);
                  }				
                }
              })
            }            
          }); 
        }else{
          var params = {
            where :where,
            type: 'accountInfo'
          }
          servercalls.postData('/request/removeLocationRequest/',params, function(err, data){                
              if(err){                      
                toastr.error("Something is wrong, please try after some time");
              }else{          
                if(data.status.status == 200){
                  toastr.success(data.status.message);                     
                  $('#accountInfo').modal('hide')
                }else{
                  toastr.error(data.status.message);
                }				
              }
          })
      }
      }
    });
  }  
  
  //update bank account information into store collection  
  $scope.updateBankInfo = function(){
    // find store details
    var where = {
      _id : $window.localStorage.getItem('id')          
    };
    servercalls.postData('/store/fetch',where, function(err, data){
      if(data.status.status == 200){  
        var columns = {
          accountNumber: $scope.bankAccountInfo.accountNumber,
          bankName: $scope.bankAccountInfo.bankName,
          routingNumber: $scope.bankAccountInfo.routingNumber,
          bankAddress: $scope.bankAccountInfo.bankAddress,
          nameOfTheAccount: $scope.bankAccountInfo.nameOfTheAccount
        };
        var params = {
          where : where,
          column : { $set: {  'bankAccountInfo'  : columns } }
        };       
        servercalls.postData('/store/updateData',params, function(err, data){  
           if(data.status.status == 200){              
              toastr.success(data.status.message);  
              $('#bank_Info').modal('hide');
              $scope.fetchStore();
            }else{
              toastr.error(data.status.message);
          }
        });        
      }else{
        toastr.error(data.status.message);
      }	
    });
  }
  
  //fetch storeInfo
  $scope.fetchData = function(storeBlock) {
        
    var that = storeBlock;
    $scope.bankAccountInfo = {};
    var where = {
      _id : $window.localStorage.getItem('id')          
    };
    servercalls.postData('/store/fetch',where, function(err, data){      
       if(data.status.status == 200){         
         if(that =='bankInfo'){
          $scope.bankAccountInfo = data.data[0].bankAccountInfo; 
          $scope.bankAccountInfo.accountNumber = parseInt($scope.bankAccountInfo.accountNumber);
          $scope.bankAccountInfo.routingNumber = parseInt($scope.bankAccountInfo.routingNumber);
          console.log("$scope.bankAccountInfo",$scope.bankAccountInfo);
         }else if(that =='accountInfo'){
          $scope.BASEURL = constantUrl.BASE_URL+"/uploads/"; 
          $scope.storeUpdateData= data.data[0].accountInfo;
         }else if(that =='contactInfo'){         
          $scope.storeUpdateData= data.data[0].contactInfo;
          $scope.storeUpdateData.contactNumber= parseInt(data.data[0].contactInfo.contactNumber);
         }
       }
    });
  }
  
  /**
   * 
   * @fileChanged
   */
  $scope.fileChanged = function($event) { 
    console.log("fileChanged");
    var files = $event.target.files;    
    console.log("files",files);
    $scope.storeImage = files[0];
    
  }
  
  
    
})