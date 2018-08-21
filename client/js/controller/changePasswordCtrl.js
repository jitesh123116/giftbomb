app.controller('changePasswordCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
      
  
  $scope.getAdminData = function(){
    var params = {
     where : { "_id" : $state.params.id }
    };
    servercalls.postData('/admin/fetchData',params , function(err, data){
      console.log("=admin data===",data);
      if(data.status!==undefined && data.status.status == 200){
        $scope.admin = data.data[0]; 
        if(data.data[0].passwordCode!=$state.params.code){          
          $state.go('login');
        }      
      }else{        
        $state.go('login');
      }
    })
  }
  $scope.getAdminData();
      
      
  //setPassword        
  $scope.reset = function(){
    
    var error =0;
    var newPassword = ($scope.user.newPassword!==undefined) ? $scope.user.newPassword.trim() : '';
    var confirmPassword = ($scope.user.confirmPassword!==undefined) ? $scope.user.confirmPassword.trim() : '';
    if(newPassword!=confirmPassword){
      error =1;
      toastr.error("New password and confirm password doesn't match!");
    } 
    if(error==0){
      var params = {
        password : confirmPassword,
        passwordCode  :""
      };
      servercalls.putData('/admin/reset-password/'+$scope.admin._id,params, function(err, data){
        if(err){
          toastr.error(err);
        }else{
          if(data.status.status == 200){            
            toastr.success("your password has been reset successfully and use the same for admin login.");
            $state.go('login');
          }else{
            toastr.error(data.status.message);
          }				
        }
      })
    }		
  }        
})