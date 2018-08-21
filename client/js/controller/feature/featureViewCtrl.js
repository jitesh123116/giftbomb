app.controller('featureViewCtrl', function($scope,$window,servercalls,$state,$rootScope,toastr){
  (function(){
    if(!$window.localStorage.getItem('adminSession')){
        $state.go('login');
    }
  })();
  $scope.featureList = {};
  $scope.current = 1;
  $scope.params = {
      page : 1,
      limit: "10"
  };
  
  /**
   * 
   * @returns {undefined}
   */
  $scope.getFeaturesList = function(){    
    if($state.params.id){
      $scope.params.id = $state.params.id;
      servercalls.postData('/feature/fetchFeaturedData', $scope.params, function(err, data){ 
        if(data.status.status == 200){
          console.log("data.data",data.data['rows']);
          //$scope.featureList = data.data[0];  
          $scope.featureList = data.data['rows'];       
          $scope.count = data.data['totalRows'];
        }
      })
    }else{
      $state.go('dashboard.feature');
    }  
  }
  
  /**
  * get paging content
  */
  $scope.pageChangeHandler = function(pageNumber) {      
    if (pageNumber) {
        $scope.params.page = pageNumber;
        $scope.getFeaturesList();
    }
  }
  
  
  $scope.getFeaturesList();
})