app.controller('searchRequestCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
	$scope.searchStringObj = {};
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
    	     $scope.fetchSearchString();
     	}
 	}
	$scope.fetchSearchString = function(){ 
		servercalls.getData('/store/record/fetchSearchRecord',$scope.params, (err, data) => {
			if(err){
				toastr.error(err);
			}
			else{
				if(data.status.status == 200){	
					$scope.searchStringObj = data.data.data;
					$scope.count= data.data.count;
				}
				else{ 
					toastr.error(data.status.message);
				}
			}
		})
    }
    $scope.fetchSearchString();		
	
})