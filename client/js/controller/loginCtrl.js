app.controller('loginCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
  
  (function(){
      if($window.localStorage.getItem('adminSession')){
          $state.go('dashboard.store');
      }
  })();
  
  
  $rootScope.loginStatus = false;
  $scope.user = {}
  $scope.login = function(){

    servercalls.postData('/admin/login',$scope.user, function(err, data){
       
      if(err){
              toastr.error("there were some problem while login");
      }else{

              if(data.status.status == 200){
                      $window.localStorage.setItem('adminSession',JSON.stringify(data.data[0]));
                      $rootScope.loginStatus = true;
                      //$cookies.putObject('loginUser',data.data[0]);
                      //console.log("$cookies.get('loginUser')",$cookies.get('loginUser'));
                      
                      $state.go('dashboard.store');                      
                      toastr.success(data.status.message);
              }else{
                      toastr.error(data.status.message);
              }				
      }
    })
  }
})