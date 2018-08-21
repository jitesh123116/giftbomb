app.controller('storeEditCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
	$scope.store = {};
	$scope.locationFilter = [];
	$scope.countryList = [];
        $scope.cityList = [];
	$scope.branchId;
	$scope.showBranch = false;
        $scope.filterLocation = "";
        
	$scope.getSingleStore = function(){
		servercalls.getData('/store/single/'+$state.params.sid, {}, function(err, data){
                                        
			if(data.status.status == 200){
				$scope.store = data.data;   
                                $scope.store.contactInfo.contactNumber = parseInt(data.data.contactInfo.contactNumber);
				$scope.branchId = data.data.branch[0].branchId;
                                if(Object.keys(data.data.branch).length==1){
                                  $scope.filterLocation = data.data.branch[0].locationName;
                                }  
				data.data.branch.forEach(function(item){
					$scope.locationFilter.push(item.locationName);
				})
                                console.log("====$scope.store.branch====",$scope.store._id);
                               // $scope.store.branch = $scope.store.branch[0];
                                if(Object.keys(data.data.branch).length==1){
                                   $scope.getCityInCountry(data.data.branch[0].country);
                                }     
			}
		})
	}
	$scope.getSingleStore();
	// get country list
	$scope.getCoutryList = function(){
		servercalls.getData('/country', {}, function(err,data){
			if(data.status.status == 200){
				data.data.forEach(function(item){
					$scope.countryList.push(item.name);
				})
			}
		})
	}
        
        
        // get country list
        $scope.getCityInCountry = function(name){
              servercalls.getData('/country/'+name+'/city', {}, function(err, city){
                      if(city.status.status == 200){                        
                              $scope.cityList = city.data[0].city;
                              console.log("$scope.cityList", $scope.cityList);
                      }
              })
        }
        
        
	
	// get city wise branch in store
	$scope.getFilterBranch = function(){  
            $scope.store.branch = [];
            servercalls.getData('/store/branch/location/'+$scope.store._id+"/"+$scope.filterLocation, {}, function(err, data){
              if(data.status.status == 200){
                $scope.store.branch = data.data;
                $scope.branchId = data.data[0].branchId;
                $scope.showBranch = true;
                      
              }
            })
	}
	//deactivateBranch branch if branch is not a default
	$scope.deactivateBranch = function(){
		servercalls.putData('/store/change-status/'+$scope.branchId, {}, function(err, data){
			if(data.status.status == 200){
				toastr.success(data.status.message);
			}
		})
	}
        
        $scope.fileChanged = function($event) {    
          var files = $event.target.files;    
          $scope.storeImage = files[0];

        }
				  $scope.fileChanged1 = function($event) {    
          var files = $event.target.files;    
          $scope.storeLogo = files[0];

        }
				
        /**
         * 
         */ 
        $scope.updateStore = function(){
          
          var website = ($scope.store.accountInfo.website!==undefined) ? $scope.store.accountInfo.website : '';
          var tagLine = ($scope.store.accountInfo.tagLine!==undefined) ? $scope.store.accountInfo.tagLine : '';   

          var payload = new FormData();
          payload.append("storeName", $scope.store.accountInfo.storeName);
          payload.append("branch_id", $scope.store.branch[0]._id);
          payload.append("_id", $scope.store._id);
          payload.append("category", $scope.store.accountInfo.category);
          payload.append("website", website);
          payload.append("tagLine", tagLine);
          payload.append("country", $scope.store.accountInfo.country);
          //payload.append("state", $scope.store.accountInfo.state);
          payload.append("firstName", $scope.store.contactInfo.firstName);
          payload.append("lastName", $scope.store.contactInfo.lastName);
          payload.append("contactNumber", $scope.store.contactInfo.contactNumber);
          payload.append("email", $scope.store.contactInfo.email);
          
          payload.append("branchphoneNumber", $scope.store.branch[0].phoneNumber);
          payload.append("branchlocationName", $scope.store.branch[0].locationName);
          payload.append("branchstate", $scope.store.branch[0].state);
          //payload.append("branchcountry", $scope.store.branch[0].country);
          payload.append("branchcity", $scope.store.branch[0].city);
          payload.append("branchpincode", $scope.store.branch[0].pincode);
          payload.append("branchlat", $scope.store.branch[0].lat);
          payload.append("branchlon", $scope.store.branch[0].lon);
          payload.append("branchaddress", $scope.store.branch[0].address);
          payload.append("branchId", $scope.store.branch[0]._id);
          payload.append('storeImage', $scope.storeImage);
           payload.append('storeLogo', $scope.storeLogo);
          console.log("payload",payload);
          //servercalls.postData('/store', payload, function(err, response){
          servercalls.editStore('/store/editStore', payload, function(err, response){
            console.log("err",err);
            console.log("response",response);
            if(response.status.status == 200){
                    $state.go('dashboard.store');
                    toastr.success(response.status.message);
            }else{
                    toastr.error(response.status.message);
            }
          })          
        }
        
        
        $scope.getCoutryList();
        
        
        /**
         * 
         */
        // get country list
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
        
})


