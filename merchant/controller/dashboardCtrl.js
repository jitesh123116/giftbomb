app.controller('redemptionCtrl', function($scope,constantUrl, servercalls,$state,$rootScope,toastr,$window){ 
  //check user login session
  (function(){
    if(!$window.localStorage.getItem('id')){
        $state.go('login');
    }
  })();
})