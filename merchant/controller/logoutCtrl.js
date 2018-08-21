app.controller('logoutCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
  console.log("wrwer");
  (function(){
      console.log("wrwer");
      $window.localStorage.removeItem('id');
      $state.go('login');
     
  })();
  
  
 
})
