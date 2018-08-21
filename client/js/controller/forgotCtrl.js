app.controller('forgotCtrl', function($scope,servercalls,$state,$rootScope,toastr){
  $scope.user = {}
  $scope.forgot = function(){    
    servercalls.putData('/admin/reset-password-request',$scope.user, function(err, data){
      if(err){
        toastr.error(err);
      }else{                    
        if(data.status.status == 200){
          $rootScope.user = data.data[0];
          toastr.success("Email has been sent, please check your inbox and follow the instructions.");
        }else{
          toastr.error(data.status.message);
        }				
      }
    })
  }
})