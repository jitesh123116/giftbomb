app.controller('storeCtrl', function($scope,constantUrl,servercalls,$state,$rootScope,toastr,$window){
  
  $scope.storeList = {};
  $scope.categoryList = {};
  $scope.searchText = '';
  $scope.category ='';
  $scope.BASEURL = constantUrl.BASE_URL; 
  $scope.current = 1;  
  $scope.params = {
      page : 1,
      limit: "10"
  };      
        
        
        

$scope.getAllStores = function(){
   console.log("getAllStores");
   console.log("params",$scope.params);
  servercalls.getData('/store/'+$scope.category, $scope.params, function(err, data){
         // console.log("storeList ",stores);
          if(data.status.status == 200){                    
            $scope.storeList = data.data['rows'];
            $scope.count = data.data['totalRows'];
          }else{
            toastr.error("can't get store list");
          }
  })
}
$scope.getAllStores();
        
	// get store categories
	$scope.getStoreCategories = function(){
		servercalls.getData('/store/categories', {}, function(err, cat){
			if(cat.status.status == 200){
				$scope.categoryList = cat.data;
			}else{
				toastr.error("can't get store list");
			}
		})
	}
	$scope.getStoreCategories();
	
        
        
        
        
	$scope.edit = function(store){
		$state.go('dashboard.userEdit',{'stores':store});
	}
        
        
  /**
  * get paging content
  */
  $scope.pageChangeHandler = function(pageNumber) {
      console.log("pageNumber", pageNumber); 
      if (pageNumber) {
          $scope.params.page = pageNumber;
          $scope.getAllStores();
      }
  }
  
  /**
   *@getCategoryWiseStore 
   */
  $scope.getCategoryWiseStore = function(){
    console.log("getCategoryWiseStore");
    $scope.current = 1;
    $scope.params.page = 1;
    $scope.getAllStores();
  }
  
  /**
   *@searchStore 
   */
  $scope.searchStore = function(){
    console.log("searchStore",$scope.searchText);
    $scope.params.search = $scope.searchText;
    $scope.current = 1;
    $scope.params.page = 1;
    $scope.getAllStores();
  }
  
  
  /**
  *@createExcelFile method is for exporting users data in excel file 
  */
 $scope.createExcelFile = function(){
    var params = {
      category : $scope.category,
      searchText : $scope.searchText
    }
    servercalls.postData('/store/excelFileData', params, function(err, data){
      if(err){
        toastr.error(data.status.message); 
      }else{
        if(data.status.status == 200){ 
          $window.location.href = $scope.BASEURL+'/uploads/storeFile.xls';
        }else{          
          toastr.error(data.status.message); 
        }
      }
    })
 }
        
})