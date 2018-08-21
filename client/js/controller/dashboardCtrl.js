app.controller('dashboardCtrl', function($scope,$window,$location,servercalls,$state,$rootScope,toastr){
  
  /** checking the user session**/
  (function(){
    if(!$window.localStorage.getItem('adminSession')){
        $state.go('login');
    }
  })();
  
  $scope.getClass = function(path) {
    var cur_path = $location.path().substr(0, path.length);   
    if (cur_path == path) {
        if($location.path().substr(0).length > 1 && path.length == 1 )
            return "";
        else
            return "active";
    } else {
        return "";
    }
}
})