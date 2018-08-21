
app.controller('register', function($scope,servercalls,$state,$rootScope,toastr,$window){
    
   $scope.user = {} 
  /**
   * 
   * @returns {undefined}
   */
    $scope.login = function(){      
      
      if($scope.user.email && $scope.user.password){         
        var where = {
          "contactInfo.email" : $scope.user.email,
          "contactInfo.password" : $scope.user.password
        }        
        servercalls.postData('/store/fetch',where, function(err, data){
          if(err){                      
            toastr.error("Something is wrong, please try after some time");
          }else{          
            if(data.status.status == 200){              
              $window.localStorage.setItem('id',data.data[0]._id);
              toastr.success(data.status.message);                     
              $state.go('dashboard');                              
            }else{
              toastr.error(data.status.message);
            }				
          }
        })
      }else{        
        toastr.error("Please fill all required fields");
      }
      
    }
})