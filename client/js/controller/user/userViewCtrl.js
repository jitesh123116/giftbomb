app.controller('userViewCtrl', function($scope,$filter,servercalls,$state,$rootScope,toastr,$window){
	$scope.store = {};
        
        $scope.fetchUserData = function(){
          if($state.params.id){
            servercalls.getData('/user/'+$state.params.id, {}, function(err, data){
              if(data.status.status == 200){
                $scope.user = data.data[0];
                console.log("$scope.user",$scope.user);
                $scope.user.dob = $filter('date')(data.data[0].dob, "mediumDate");
                $scope.user.phoneNumber = parseInt(data.data[0].phoneNumber);
              }else{
                $state.go('dashboard.user');
              }
            })
          }else{
            $state.go('dashboard.user');
          }   
        }
        $scope.fetchUserData();
})