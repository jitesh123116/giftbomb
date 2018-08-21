app.controller('resetCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
      
  
  $scope.getSingleStore = function(){
    servercalls.getData('/store/single/'+$state.params.id, {}, function(err, data){

      if(data.status.status == 200){
        $scope.store = data.data; 
        if(data.data.passwordCode!=$state.params.code){
          $state.go('login');
        }       
      }
    })
  }
  $scope.getSingleStore();
      
      
  //setPassword        
  $scope.reset = function(){    var error=0;
   
    var error =0;
    var newPassword = ($scope.user.newPassword!==undefined) ? $scope.user.newPassword.trim() : '';
    var confirmPassword = ($scope.user.confirmPassword!==undefined) ? $scope.user.confirmPassword.trim() : '';
    if(newPassword!=confirmPassword){
      error =1;
      toastr.error("New password and confirm password doesn't match!");
    } 
    if(error==0){
      var params = {
        where : {"_id":$scope.store._id, "passwordCode" : $scope.store.passwordCode},
        column : {$set : {"contactInfo.password":confirmPassword, "passwordCode" :""} }
      };
      servercalls.postData('/store/updateData/',params, function(err, data){
        if(err){
                toastr.error(err);
        }else{
          if(data.status.status == 200){
                  $state.go('login');
                  toastr.success("Password gererated successfully and use the same for merchant login.");
          }else{
                  toastr.error(data.status.message);
          }				
        }
      })
    }		
  }        
})