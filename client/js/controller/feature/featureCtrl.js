app.controller('featureCtrl', function($scope,$window,servercalls,$state,$rootScope,toastr){
  (function(){
    if(!$window.localStorage.getItem('adminSession')){
        $state.go('login');
    }
  })();
  $scope.featureList = {};
  $scope.city = 'all';
  $scope.cityList = {};
  $scope.current = 1;
  $scope.params = {
      page : 1,
      limit: "10"
  }; 
  
  $scope.getAllFeatures = function(){
    $scope.params.city = $scope.city;
    servercalls.postData('/feature/fetchData', $scope.params, function(err, data){
      if(data.status.status == 200){
        $scope.featureList = data.data['rows'];       
        $scope.count = data.data['totalRows'];
      }
    })
  }
  

  /**
   *@fetchDistinctCities 
   */
  $scope.fetchDistinctCities = function(){
    servercalls.postData('/feature/fetchDistinctFeaturedCities', {}, function(err, data){
      if(data.status.status == 200){
        $scope.cityList = data.data;
      }
    })
  }
  
  /**
   *@filterData
   */
  $scope.filterData = function(){
    $scope.getAllFeatures();
  }
  
  
  /**
  * get paging content
  */
  $scope.pageChangeHandler = function(pageNumber) {      
    if (pageNumber) {
        $scope.params.page = pageNumber;
        $scope.getAllFeatures();
    }
  }
  
  $scope.fetchDistinctCities();        
  $scope.getAllFeatures();
})