app.controller('logoutCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
  
  (function(){
      $window.localStorage.removeItem('adminSession');
      $state.go('login');
     
  })();
  
  
 
})
