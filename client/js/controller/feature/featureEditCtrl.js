app.controller('featureEditCtrl', function ($scope, $filter, servercalls, $state, $rootScope, toastr, $window) {
  
  (function(){
    if(!$window.localStorage.getItem('adminSession')){
        $state.go('login');
    }
  })();
  
  $scope.categoryList = [];
  $scope.cityList = [];
  $scope.branchList = [];
  $scope.list = {};
  $scope.list.listItem = [];
  $scope.category = "all";
  $scope.edit = false;
  $scope.checkedArray = [];
  
  $scope.current = 1;
  $scope.params = {
      page : 1,
      limit: "10"
  };

  
  $scope.getFeaturesList = function () {
    servercalls.getData('/feature/id/' + $state.params.id, {}, function (err, data) {      
      if (data.status.status == 200) {
        $scope.list.listName = data.data[0].listName;
        $scope.list.city = data.data[0].city;       
        $scope.list._id = data.data[0]._id;
        $scope.list.startDate = $filter('date')(data.data[0].startDate, "MM/dd/yyyy h:mm:ss",'+0000');        
        $scope.list.endDate = $filter('date')(data.data[0].endDate, "MM/dd/yyyy h:mm:ss",'+0000');
        for (var i = 0; i < data.data[0].listItem.length; i++) {        
          $scope.checkedArray[data.data[0].listItem[i]._id] = true;
          $scope.list.listItem.push(data.data[0].listItem[i]._id);
        }        
        $scope.getBranch();
        $scope.getStoreCategories();
      } else {
        toastr.error("error while geting featureList");
      }
    })
  }
  

  // get store category
  $scope.getStoreCategories = function(){          
    if ($scope.list.city === undefined || $scope.list.city ===null) {
      $scope.list.city = '';
    }

    servercalls.postData('/store/getCategoriesCityBasis/',{city:$scope.list.city}, function(err, cat){    
      if(cat.status.status == 200){
        $scope.categoryList = cat.data;                    
      }else{
        toastr.error("can't get store list");
      }
    })
  }
  // get store city
  $scope.getStoreCity = function () {
    servercalls.getData('/store/city', {}, function (err, city) {
      if (city.status.status == 200) {
        $scope.cityList = city.data;        
      } else {
        toastr.error("can't get store list");
      }
    })
  }

  // get all branch based on category and city
  $scope.getBranch = function(){
    if ($scope.list.city === undefined || $scope.list.city ===null) {
      $scope.list.city = '';
    }
    if ($scope.category === undefined || $scope.category ===null || $scope.category == '') {
      $scope.category = 'all';
    }
    $scope.params['city'] = $scope.list.city;
    $scope.params['category'] = $scope.category;

    servercalls.postData('/store/getBranchWithLimit', $scope.params, function(err, branch){
      
      if(branch.status.status == 200){              
        $scope.branchList = branch.data['rows'];       
        $scope.count = branch.data['totalRows'];    
        /** start for checked list of branches **/
        $scope.list.itemList = [];
        for(var i = 0; i < $scope.branchList.length; i++) {
          if ($scope.list.listItem.indexOf($scope.branchList[i]._id) > -1) {
            $scope.list.itemList[($scope.branchList[i]._id)] = true; ;
          }
        }
        /** end for checked list of branches **/
      }else{
        toastr.error("can't get store list");
      }
    })
  }
 
  
  /**
   * 
   * @returns {undefined}
   */
  $scope.getFilterBranch = function(){
                
    $scope.current = 1;
    $scope.params.page = 1;
    $scope.getBranch();
    $scope.getStoreCategories();
  }
  
  
  // Add or update list
  $scope.addOrUpdateList = function () {
    var error=0;
    var listName = ($scope.list.listName!==undefined) ? $scope.list.listName.trim() : '';
    var city = ($scope.list.city!==undefined) ? $scope.list.city.trim() : '';
    var startDate = ($scope.list.startDate!==undefined) ?  $scope.list.startDate : '';         
    var endDate = ($scope.list.endDate!==undefined && $scope.list.endDate) ? $scope.list.endDate : '';
    var listItem = ($scope.list.itemList!==undefined) ? $scope.list.itemList : '';
  
    if(Object.keys(listItem).length>0){
        var newList =[];
        var count=0;
        for(var key in listItem) {
          if(listItem[key]==true){            
            newList.push(key);   
          }else if(listItem[count]!==undefined){
            newList.push(listItem[count]);   
          }
          count++;
        }
        listItem = newList;
    }
    if(startDate){      
      startDate = startDate.split("/");
      var time = startDate[2].split(" ");      
      startDate[2] = time[0];
      time = time[1];
      startDate = startDate[2]+"/"+startDate[0]+"/"+startDate[1]+" "+time;
    }
    if(endDate){                      
      endDate = endDate.split("/");            
      var time = endDate[2].split(" ");
      endDate[2] = time[0];
      time = time[1];            
      endDate = endDate[2]+"/"+endDate[0]+"/"+endDate[1]+" "+time;
    }
    if(listName=='' || city=='' || startDate==''){
      error = 1;
      toastr.error('Please fill all required fields!');            
    }else if(listItem==''){
      error = 1;
      toastr.error('Please select atleast one branch!');            
    } else if(startDate && endDate){
        if (new Date(startDate) > new Date(endDate)) {
          error = 1;
          toastr.error('End date should be equal or greater than the start date!');
        }
    }
    
    if(error==0){
      var data = {
        listName : listName,
        city : city,
        startDate : startDate,
        endDate : endDate,
        listItem : listItem,
        _id : $scope.list._id
      }
      
      servercalls.putData('/feature', data, function (err, newList) {
        if(err){
          toastr.error(err.status.message);
        }else{
          if (newList && newList.status.status == 200) {
          $state.go('dashboard.feature');
          toastr.success(newList.status.message);
          } else {
            toastr.error(newList.status.message);
          }
        }        
      })
    }
  }
  
  /**
  * get paging content
  */
  $scope.pageChangeHandler = function(pageNumber) {      
    if (pageNumber) {
        $scope.params.page = pageNumber;
        $scope.getBranch();
    }
  }

  
  $scope.getFeaturesList();  
  $scope.getStoreCity();  
  
}).directive('timepicker', [

  function() {
    var link;
    link = function($scope, element, attr, ngModel) {       
        element = $(element);
        element.datetimepicker({
          useCurrent: true,
          //minDate: moment(),
          format: 'MM/DD/YYYY HH:mm:ss',
          defaultDate: $scope[attr.ngModel]
      	});        
        element.on('dp.change', function(e) {            
          $scope.$apply(function(){            
            var d = new Date(e.date);           
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var year = d.getFullYear();
            var hour = d.getHours();
            var min = d.getMinutes();
            var sec = d.getSeconds();
            var setter = month+'/'+day+'/'+year+' '+hour+':'+min+':'+sec;            
            ngModel.$setViewValue(setter);           
          });
        });
    };
    return {
      restrict: 'A',
      link: link,
      require: 'ngModel'
    };
  }
])