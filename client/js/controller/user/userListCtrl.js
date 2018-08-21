app.controller('userListCtrl', function($scope,constantUrl,servercalls,$state,$rootScope,toastr,$window){
  
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
  $scope.getAllUsers = function(){    
    console.log("$scope.params",$scope.params);
    servercalls.postData('/user/getUserList', $scope.params, function(err, data){

      if(data.status.status == 200){
              $scope.userList = data.data['rows'];
              $scope.count = data.data['totalRows'];
      }else{
              toastr.error("Error while geting user list");
      }
    })
  }
  $scope.getAllUsers();
  
  /**
   * 
   * @param {type} user
   * @returns {undefined}
   */
  $scope.edit = function(user){
    $state.go('dashboard.userEdit',{'user':user});
  }
  
  
  /**
  * get paging content
  */
 $scope.pageChangeHandler = function(pageNumber) {
     console.log("pageNumber", pageNumber); 
     if (pageNumber) {
         $scope.params.page = pageNumber;
         $scope.getAllUsers();
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
 
 /**
  * 
  */
  $scope.searchUserData = function(){
    $scope.params.search = $scope.searchText;
    $scope.current = 1;
    $scope.params.page = 1;
    $scope.getAllUsers();
  }
  
  /**
   *@deleteData is used to delete user 
   */
  $scope.deleteData = function(id){
                
    if (confirm("Are you sure to delete this user?") == true) {
        servercalls.deleteData('/user/deleteUser/'+id, function(err, data){
          if(err){
            toastr.error(data.status.message);
          }else{
            if(data.status.status == 200){              
              toastr.success(data.status.message);
              window.location.reload();
            }else{
              toastr.error(data.status.message);
            }
          }
          
        })
      }    
  }
  
})

