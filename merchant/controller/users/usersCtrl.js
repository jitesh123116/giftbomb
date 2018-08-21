app.controller('usersCtrl', ['$scope', '$state', 'http', function($scope, $state, http) {

    $scope.page = {
        name: 'users',
        id: '1'
    }

    $scope.$emit('page', $scope.page);

    $scope.getUserList = function() {
        $scope.isLoading = true;
        http.getUserList($scope.data).then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                $scope.getUserList = res;  
                console.log($scope.getUserList ) ;       

            } else {
                alert(res.message);
            }
        });
    }


    $scope.getUserList();

 
  /**
     * get paging content
     */
    $scope.pageChangeHandler = function(pageNumber) {
        if (pageNumber) {
            $scope.data.page = pageNumber;
        }
    }


}]);
