app.controller('resetCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
          console.log("$scope.user",$window.localStorage.getItem('adminSession'));     
        (function(){
            if($window.localStorage.getItem('adminSession')===undefined || $window.localStorage.getItem('adminSession')===null){
                $state.go('login');
            }
        })();
  
	$scope.user = {}	
	$scope.reset = function(){
          
              var userSession = $window.localStorage.getItem('user');
		
		if($scope.user.password == $scope.cpassword){
			servercalls.putData('/admin/change-password/'+userSession._id ,$scope.user, function(err, data){
				console.log("data",data);
				if(err){
					console.log("there were some problem while login");
				}else{
					if(data.status.status == 200){
						$state.go('login');
						toastr.success(data.status.message);
					}else{
						toastr.error(data.status.message);
					}				
				}
			})
		}else{
			toastr.error("password and confirm password doesn't match!");
		}		
	}
        
        //setPassword        
        $scope.setPassword = function(){
          
         
         
          var userSession = JSON.parse($window.localStorage.getItem('adminSession'));
          var error=0;
          var oldPassword = ($scope.user.oldPassword!==undefined) ? $scope.user.oldPassword.trim() : '';
          var newPassword = ($scope.user.newPassword!==undefined) ? $scope.user.newPassword.trim() : '';
          var confirmPassword = ($scope.user.confirmPassword!==undefined) ? $scope.user.confirmPassword.trim() : '';
          if(newPassword!=confirmPassword){
            error =1;
            toastr.error("New password and confirm password doesn't match!");
          }    
                
          if(error==0){
                  servercalls.putData('/admin/change-password/'+userSession._id ,$scope.user, function(err, data){
                          
                          if(err){
                                  toastr.error(err);
                          }else{
                                  if(data.status.status == 200){
                                          $state.go('dashboard');
                                          toastr.success(data.status.message);
                                  }else{
                                          toastr.error(data.status.message);
                                  }				
                          }
                  })
          }		
	      }        
})
