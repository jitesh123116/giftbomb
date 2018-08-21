app.controller('requestCtrl', function($scope,constantUrl,$q,$state,servercalls,$state,$rootScope,toastr){
  $scope.requestData = [];
  $scope.branchData = [];
  $scope.typesOfRequest = 'all';
  $scope.previousArray = {};
  $scope.requestArray = {};
  $scope.FieldArray = {};
  $scope.backGroundColor = "";
  $scope.fontColor = "";
  $scope.current = 1;
  $scope.BASEURL = constantUrl.BASE_URL; 
  $scope.RequestNameArray = {
    promotionName : 'Offer Name',
    originalValue : 'Original Value',
    offerValue : 'Offer Value',
    startDate : 'Start Date',
    endDate : 'End Date',
    storeName : 'Store Name',
    category : 'Category',
    website : 'Website',
    country : 'Country',
    tagLine : 'Tag line',
    storeThumbnail : 'Store Image',
    firstName : 'First Name',
    lastName : 'Last Name',
    contactNumber : 'Phone',
    email : 'Email',
    phoneNumber : 'Phone',
    locationName : 'Location Name',
    address : 'Address',
    pincode : 'Zip Code',
    city : 'City',
    state : 'State',
    lat : 'Latitude',
    lon : 'Longitude',
		promotionLogo:"Promotion Logo"
  }
  $scope.params = {
      page : 1,
      limit: "10"
  };
  
  
  
  /**
   *@getAllRequest          
   */
  $scope.getAllRequest = function(){
    
    servercalls.getData('/request/type/'+$scope.typesOfRequest+'/'+$scope.params.limit+'/'+$scope.params.page+'/'+0, {}, function(err,requestData){
      $scope.requestList = [];
      if(err){       
        toastr.error(requestData.status.message);
      }else {        
        if(requestData && requestData.status.status == 200){         
          if(requestData.data['rows']!==undefined && requestData.data['rows'].length>0){           
            $scope.requestList = requestData.data['rows'];
            $scope.count = requestData.data['totalRows'];
          }
        }
      }  
    })
  }
                        
  /**
   * 
   * @param {type} id
   * @returns {undefined}
   */
  $scope.viewRequest = function(id){
    
    servercalls.getData('/request/'+id,{}, function(err,data){ 
			
			console.log("data",data);
      if(err){
        $state.go('dashboard.request');
      }else if(data && data.status.status == 200){    
        $scope.requestData = data.data[0];  
        var storeId = $scope.requestData.storeId;

        if($scope.requestData.requestType=='storeInfo'){
          $scope.requestData.requestType = 'Store Information';

          if($scope.requestData.updateData.accountInfo!==undefined){
            angular.forEach($scope.requestData.updateData.accountInfo, function(value, key) {                    
              $scope.requestArray[$scope.RequestNameArray[key]] = value;                   
              $scope.FieldArray["accountInfo."+key] =  value;                    
              $scope.previousArray[$scope.RequestNameArray[key]] = (storeId!==undefined && storeId.accountInfo!==undefined && storeId.accountInfo[key]!==undefined) ? storeId.accountInfo[key] : '';
            });                    
          }
          if($scope.requestData.updateData.contactInfo!==undefined){
            angular.forEach($scope.requestData.updateData.contactInfo, function(value, key) {
              $scope.requestArray[$scope.RequestNameArray[key]] = value;
              $scope.FieldArray["contactInfo."+key] =  value;  
              $scope.previousArray[$scope.RequestNameArray[key]] = (storeId!==undefined && storeId.contactInfo!==undefined && storeId.contactInfo[key]!==undefined) ? storeId.contactInfo[key] : '';
            });                    
          }
        }else if($scope.requestData.requestType=='designInfo'){
          $scope.requestData.requestType = 'Design Information';
          angular.forEach($scope.requestData.updateData.designInfo, function(value, key) {            
            $scope.requestArray[$scope.RequestNameArray[key]] = value;                   
            $scope.FieldArray["designInfo."+key] =  value;                    
            $scope.previousArray[$scope.RequestNameArray[key]] = (storeId!==undefined && storeId.designInfo!==undefined && storeId.designInfo[key]!==undefined) ? storeId.designInfo[key] : '';
          });
        }else if($scope.requestData.requestType=='locationInfo'){
          var branchId = $scope.requestData.branchId;

          $scope.requestData.requestType = 'Location Information';
          angular.forEach($scope.requestData.updateData.branch, function(value, key) {

            $scope.requestArray[$scope.RequestNameArray[key]] = value;                   
            $scope.FieldArray[key] =  value;                    
            $scope.previousArray[$scope.RequestNameArray[key]] = (branchId!==undefined && branchId[key]!==undefined) ? branchId[key] : '';
          });
        }else if($scope.requestData.requestType=='promotionInfo'){
					//console.log("promotioninfo---",$scope.requestData.updateData);
          $scope.requestData.requestType = 'Promotion Information';
          angular.forEach($scope.requestData.updateData.promotionInfo, function(value, key) {      
						console.log("key--",key +"---vakue",value);
            $scope.requestArray[$scope.RequestNameArray[key]] = value;                   
            $scope.FieldArray[key] =  value;                    
            //$scope.previousArray[key] = (storeId!==undefined && storeId.designInfo!==undefined && storeId.designInfo[key]!==undefined) ? storeId.designInfo[key] : '';
          });
        }
        //console.log("requestArray",requestArray);        
        //console.log("FieldArray",FieldArray);       
        
      }else{
        $state.go('dashboard.request');
      }            
    })
  }
                
  /**
   * 
   *@getFilterRequest
   */
  $scope.getFilterRequest = function(){
    $scope.current = 1;
    $scope.params.page = 1;
    $scope.getAllRequest();
  }
        
  /**
   *@declineRequest 
   */
  $scope.declineRequest = function(){    

    /** set status as decline After decline by Admin **/
    var params = {
      column : { $set : {status :2}} ,
      where : { _id : $scope.requestData._id}
    }
    servercalls.postData('/request/updateData', params, function(err,data){
      if(err){
        toastr.error(err.status.message);
      }else{
        if(data && data.status.status == 200){   
          toastr.success("Your request has been declined successfully.");
          $state.go("dashboard.request")
        }else{
          toastr.error(err.status.message);
        }
      }  
    })
  }
        
  /**
   *@Reflect Request into the collections
   */
  $scope.update = function(){ 
    
    if($scope.requestData.requestType=='Promotion Information'){
      $scope.savePromotionData();
      
    }else if($scope.requestData.branchId!==undefined){

      var params = {
       column : { $set :  $scope.FieldArray  },
       where : {_id : $scope.requestData.branchId_id} 
      }          
      servercalls.postData('/store/updateBranchData', params, function(err,data){
        if(err){
          toastr.error(err.status.message);
        }else if(data && data.status.status == 200){   

          /** set status as accept After accepted by Admin **/
          var params = {
            column : { $set : {status :1}} ,
            where : { _id : $scope.requestData._id}
          }
          servercalls.postData('/request/updateData', params, function(err,data){
            if(err){
              toastr.error(err.status.message);
            }else if(data && data.status.status == 200){   
                toastr.success("Your request has been accepted successfully.");
                $state.go("dashboard.request")
            }else{
              toastr.error(data.status.message);
            }                
          })
        }else{
          toastr.error(data.status.message);
        }          
      })            
    }else{
      var params = {
       column : { $set :  $scope.FieldArray  },
       where : {_id : $scope.requestData.storeId} 
      }          
      servercalls.postData('/store/updateData', params, function(err,data){
        if(err){
          toastr.error(err.status.message);
        }else{
          if(data && data.status.status == 200){   

              /** set status as accept After accepted by Admin **/
              var params = {
                column : { $set : {status :1}} ,
                where : { _id : $scope.requestData._id}
              }
              servercalls.postData('/request/updateData', params, function(err,data){
              if(err){
                toastr.error(err.status.message);
              }else if(data && data.status.status == 200){   
                  toastr.success("Your request has been accepted successfully.");
                  $state.go("dashboard.request")
              }else{
                toastr.error(data.status.message);
              }                
            })
          }else{
            toastr.error(data.status.message);
          }
        }  
      })
    }
  }
        
  /**
  * get paging content
  */
  $scope.pageChangeHandler = function(pageNumber) {      
    if (pageNumber) {		
        $scope.params.page = pageNumber;
        $scope.getAllRequest();
    }
  }      
    
  /**
   *@savePromotionData is used to insert document into promotions collections
   */
  $scope.savePromotionData = function() {
		
		console.log($scope.FieldArray,"save promotion data");
    var startDate = ($scope.FieldArray.startDate!==undefined) ? $scope.FieldArray.startDate : '';
    var endDate = ($scope.FieldArray.endDate!==undefined) ? $scope.FieldArray.endDate : '';
    if(startDate){
      startDate = startDate.split("/");
      startDate = startDate[2]+"/"+startDate[0]+"/"+startDate[1];
    }
    if(endDate){
      endDate = endDate.split("/");
      endDate = endDate[2]+"/"+endDate[0]+"/"+endDate[1];
    }      
    var postArray = {
      storeId : $scope.requestData.storeId._id,
      promotionName : ($scope.FieldArray.promotionName!==undefined) ? $scope.FieldArray.promotionName : '',
      offerValue : ($scope.FieldArray.offerValue!==undefined) ? $scope.FieldArray.offerValue : '',       
      originalValue : ($scope.FieldArray.originalValue!==undefined) ? $scope.FieldArray.originalValue : '' ,
      startDate : startDate,
      endDate : endDate,
			promotionLogo:$scope.FieldArray.promotionLogo
    };      
    servercalls.postData('/promotion/', postArray, function(err,data){
      if(err){
        toastr.error(err.status.message);
      }else if(data && data.status.status == 200){
        
        /** set status as accept After approval **/
        var params = {
          column : { $set : {status :1}} ,
          where : { _id : $scope.requestData._id}
        }
        servercalls.postData('/request/updateData', params, function(err,data){
          if(err){
            toastr.error(err.status.message);
          }else if(data && data.status.status == 200){   
              toastr.success("Your request has been accepted successfully.");
              $state.go("dashboard.request")
          }else{
            toastr.error(data.status.message);
          }
        })        
      }else{
        toastr.error(data.status.message);
      } 
    });
  }
        
  /**
   *@Manage Routing 
   */
  if($state.params.method!==undefined && $state.params.method=='view'){    
    $scope.viewRequest($state.params.id);
  }
  $scope.getAllRequest();
  //$state.go('dashboard.request');
  
})

