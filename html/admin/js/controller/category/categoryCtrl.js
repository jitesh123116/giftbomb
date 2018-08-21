app.controller('categoryCtrl', ['$scope', '$state', 'http', function($scope, $state, http) {


    $scope.page = {
        name: 'Category',
        id: '2'
    }

    $scope.$emit('page', $scope.page);

   	$scope.data = {
        page: 1
    }

    $scope.currentPage = 1;
    $scope.pageSize = 10;
    
   	/**
	*Get category
   	*/
    $scope.getCategories = function(){
    	$scope.isLoading = true;
    	http.getCategories().then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                $scope.categoryList = res.data.result;   

            } else {
                alert(res.message);
            }
        });
    }

    /**
    *Initialize getCategories function
    */
	$scope.getCategories();


    /**
     * get paging content
     */
    $scope.pageChangeHandler = function(num) {
      console.log('meals page changed to ' + num);
    };

	/**
	*Add category
	*/
	$scope.addCategory = function(){
		$scope.isLoading = true;
    	http.addCategories($scope.data).then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                angular.element('#addCategoryModal').modal('hide');
                $scope.data.catName = '';
                $scope.getCategories();
                
            } else {
                alert(res.message);
            }
        });
	}


}]);
