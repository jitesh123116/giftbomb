app.controller('storeViewCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
	$scope.store = {};
	$scope.locationFilter = [];
	$scope.countryList = [];
	$scope.branchId;
	$scope.showBranch = false;
	$scope.getSingleStore = function(){
          servercalls.getData('/store/admin/single/'+$state.params.id, {}, function(err, data){
            if(data.status.status == 200){
							console.log(data.data,":print data");
              $scope.store = data.data;
              $scope.branchId = data.data.branch[0].branchId;
              $scope.filterLocation = data.data.branch[0].locationName;
              data.data.branch.forEach(function(item){
                      $scope.locationFilter.push(item.locationName);
              })
              console.log("$scope.locationFilter",$scope.locationFilter, $scope.store );  

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
	$scope.getCoutryList();
	// get city wise branch in store
	$scope.getFilterBranch = function(){
          $scope.store.branch = [];
          servercalls.getData('/store/branch/location/'+$state.params.id+"/"+$scope.filterLocation, {},function(err, data){
              if(data.status.status == 200){
                  $scope.store.branch = data.data;
                  $scope.branchId = data.data[0].branchId;
                  $scope.showBranch = true;
              }
          })
	}
        
        
        
        // get city wise branch in store
	$scope.getFilterBranch1 = function(){
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
})