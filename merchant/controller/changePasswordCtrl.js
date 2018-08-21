app.controller('changePasswordCtrl', function($scope,constantUrl, servercalls,$state,$rootScope,toastr,$window){ 
  //check user login session
  (function(){
    if(!$window.localStorage.getItem('id')){
        $state.go('login');
    }
  })();
  $scope.user = {}	
	$scope.reset = function(){
          
              var id = $window.localStorage.getItem('id');
		
		if($scope.user.password == $scope.cpassword){
			servercalls.putData('/merchant/change-password/'+id ,$scope.user, function(err, data){
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
         
         
          var id = ($window.localStorage.getItem('id'));
          console.log("userSession"+ id)
          var error=0;
          var oldPassword = ($scope.user.oldPassword!==undefined) ? $scope.user.oldPassword.trim() : '';
          var newPassword = ($scope.user.newPassword!==undefined) ? $scope.user.newPassword.trim() : '';
          var confirmPassword = ($scope.user.confirmPassword!==undefined) ? $scope.user.confirmPassword.trim() : '';
          if(newPassword!=confirmPassword){
            error =1;
            toastr.error("New password and confirm password doesn't match!");
          }    
                
          if(error==0){

            var postParameter = {
              where : {
                _id : id
              },
              oldPassword : {oldPassword},
              column : { '$set' : {
                "contactInfo.password" : confirmPassword,
              }
              }
            }


              servercalls.postData('/store/changePassword' ,postParameter, function(err, data){
                      
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
