app.controller('productsCtrl', ['$scope', '$state', 'http', function($scope, $state, http) {

    $scope.page = {
        name: 'Products',
        id: '2'
    }

    $scope.$emit('page', $scope.page);

    $scope.data = {
        page: 1
    }




    /**
     *Get product list
     */
    $scope.getProductList = function() {
        $scope.isLoading = true;
        http.getProductList($scope.data).then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                $scope.count = res.data.result.totalDataCount;
                $scope.products = res.data.result.products;

            } else {
                alert(res.message);
            }
        });
    }


    /**
     *Initialize getProductList function
     */
    $scope.getProductList();


    /**
     * get paging content
     */
    $scope.pageChangeHandler = function(pageNumber) {
        if (pageNumber) {
            $scope.data.page = pageNumber;
            $scope.getProductList();
        }
    }


    /**
    *Delete product
    */
    $scope.deleteProduct = function(id){
        console.log(id);
        var data = {
            id : id
        }
        
    }



}]);
