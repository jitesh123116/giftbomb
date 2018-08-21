app.controller('productViewCtrl', ['$scope', '$state', 'http', function($scope, $state, http) {

    $scope.page = {
        name: 'View Product',
        id: '2'
    }

    $scope.$emit('page', $scope.page);

    console.log($state);

    if(!$state.params.id){
    	$state.go('dashboard.products');
    }


    $scope.data = {
    	product_id : parseInt($state.params.id)
    }
    
    /**
     *Get product detail
     */
    $scope.getProductDetails = function() {
        $scope.isLoading = true;
        http.getProductDetails($scope.data).then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                $scope.productDetail = res.data.result.productDetals;          

            } else {
                alert(res.message);
            }
        });
    }


    $scope.getProductDetails();

}]);
