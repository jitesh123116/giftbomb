app.controller('promotionsCntrl',function($scope,constantUrl,servercalls,$state,$rootScope,toastr,$window){
  
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
	$scope.promotionList=[];
        
        
        

$scope.getAllStores = function(){
   console.log("getAllStores");
   console.log("params",$scope.params);
  servercalls.getData('/store/'+$scope.category, $scope.params, function(err, data){
           console.log("storeList ",data);
          if(data.status.status == 200){                    
            $scope.storeList = data.data['rows'];
            $scope.count = data.data['totalRows'];
          }else{
            toastr.error("can't get store list");
          }
  })
}
$scope.getAllStores();
                  
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
 
    new autoComplete({
          selector: '#search',
					minChars: 1,
          source: function(term, suggest){
            $scope.choices =[];
					console.log("----> searcg",$scope.search)
            if($scope.search!==undefined && $scope.search.trim()){
							console.log("----> searcg",$scope.search)
              servercalls.getData('/store/search', {"storeName":$scope.search}, function(err, data){
                if(data.status.status == 200){
                  for(var i=0; i<data.data.length;i++){
                     $scope.choices.push( data.data[i].accountInfo['storeName']);                 
                  }
                  term = term.toLowerCase();           
                  var suggestions = [];
                  suggestions =$scope.choices;
                  suggest(suggestions);
                }
              })
            }
          },
          onSelect: function(e, term, item){
            if(term.trim()){
              servercalls.getData('/store/search', {"storeName":term,"storeNameExactFlag":1}, function(err, data){
								console.log(">>>>>>>>",data);
                if(data.status.status == 200){
                  $scope.store = data.data[0];               
                  $scope.store.storeId = data.data[0]._id;
                }
              })
            }
          }
      });
          $scope.setSerachData = function(){
    console.log("---> helllo");
    } 
					$scope.SearchStoreData = function(params){
						console.log(">>>>>>",$scope.search)
						servercalls.getData('/promotion/admin/promotionList',{"page":$scope.params.page,"limit":$scope.params.limit,"storeName":$scope.search},function(err,data){
							console.log("store Data>>>>",err,data);
							if(data.status.status == 202){
								
								$scope.promotionList = data.data;
								console.log("store Data?????",$scope.promotionList);
							}
						})
					}
})