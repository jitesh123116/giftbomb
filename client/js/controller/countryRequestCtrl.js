app.controller('countryRequestCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
	$scope.searchCountryObj = {};
	
	$scope.params = {
      page : 1,
      limit: "10"
    };
    /**
  * get paging content
  */
 	$scope.pageChangeHandler = function(pageNumber) {
  	   console.log("pageNumber", pageNumber); 
  	   if (pageNumber) {
   	      $scope.params.page = pageNumber;
    	     $scope.fetchCountryString();
     	}
 	}
	$scope.fetchCountryString = function(){ 

		servercalls.getData('/country/fetchCountryRecord',$scope.params, (err, data) => {
			if(err){
				toastr.error(err);
			}
			else{ 
				if(data.status.status == 200){	
					$scope.searchCountryObj = data.data.data;
					$scope.count = data.data.count;
				}
				else{ 
					toastr.error(data.status.message);
				}
			}
		})
    }
    $scope.fetchCountryString();		
	
})