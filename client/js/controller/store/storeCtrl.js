app.controller('storeCtrl', function($scope,constantUrl,servercalls,$state,$rootScope,toastr,$window){
  
  $scope.searchText = '';

 

$scope.annotations = (function() {
  if(window.localStorage) {
      var annotations = JSON.parse(localStorage.getItem("annotations"));
    console.log(annotations,"annotation")
      if( !annotations || annotations.length == 0 ) {
          window.localStorage.setItem("annotations", JSON.stringify(defaultAnnotations));
          return defaultAnnotations;
      }
      return annotations;
  } else {
      return [];
  }
})();
 
      console.log("store");  
        
      servercalls.anootationShow($scope.annotations);



	
        
        

  
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