app.controller('notificationsCntrl', function($scope,constantUrl,servercalls,$state,$rootScope,toastr,$window){
  
  $scope.BASEURL = constantUrl.BASE_URL;   
  $scope.userList = {};   
  $scope.current = 1;
  $scope.params = {
      page : 1,
      limit: "10"
  };
  /**
   * 
   * @returns {undefined}
   */
  $scope.getAllNotifications = function(){    
    console.log("$scope.params",$scope.params);
    servercalls.getData('/notification/admin/notificationList', $scope.params, function(err, data){
console.log("----->notification data list",err,data);
      if(data.status.status == 200){
              $scope.notificationsList = data.data;
              $scope.count = data.data.length;
      }else{
              toastr.error("Error while geting user list");
      }
    })
  }
  $scope.getAllNotifications();
  
  /**
   * 
   * @param {type} user
   * @returns {undefined}
   */
//  $scope.edit = function(user){
//    $state.go('dashboard.userEdit',{'user':user});
//  }
  
  
  /**
  * get paging content
  */
 $scope.pageChangeHandler = function(pageNumber) {
     console.log("pageNumber", pageNumber); 
     if (pageNumber) {
         $scope.params.page = pageNumber;
         $scope.getAllNotifications();
     }
 }
 
 /**
  *@createExcelFile method is for exporting users data in excel file 
  */
 $scope.createExcelFile = function(){
    
    var params = {     
      searchText : $scope.searchText
    }   
    servercalls.postData('/user/excelFileData', params, function(err, data){
      if(err){
        toastr.error(data.status.message); 
      }else{
        if(data.status.status == 200){ 
          $window.location.href = $scope.BASEURL+'/uploads/file.xlsx';
        }else{          
          toastr.error(data.status.message); 
        }
      }
    })
 }
 
})

