app.controller('requestViewCtrl', function($scope,servercalls,$state,$rootScope,toastr){
	$scope.newData = {};
	$scope.store = {};
	$scope.storeId = '';
	$scope.branchId = '';
	$scope.allKey = [];
	if($state.params && $state.params.request){
		$scope.newData = $state.params.request;
		$scope.storeId = $state.params.request.storeId;
		if($scope.newData.hasOwnProperty(branchId)){
			$scope.branchId = item[key];
		  $scope.getStoreDetailWithBranch();
		}else{
			$scope.getStoreDetail();
			$scope.newData.updateData.forEach(function(item){
				for (key in item) {
					$scope.allKey[key] = true;
				}
			})
		}
	}
	// get store detail
	$scope.getStoreDetailWithBranch = function(){
		servercalls.getData('/store/branch/'+$scope.storeId+"/"+$scope.branchId, {}, function(err,data){
			if(data && data.status.status == 200){
				$scope.store = data.data;
				console.log("store data",$scope.store);
			}else{
				toastr.error(err.status.message);
			}
		})
	}
	$scope.getStoreDetail = function(){
		servercalls.getData('/store/single/'+$scope.storeId, {}, function(err,data){
			if(data && data.status.status == 200){
				$scope.store = data.data;
				console.log("store data",$scope.store);
			}else{
				toastr.error(err.status.message);
			}
		})
	}
})