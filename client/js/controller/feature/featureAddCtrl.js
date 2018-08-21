app.controller('featureAddCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
  	$scope.categoryList=[];
	$scope.cityList=[];
	$scope.branchList = [];
	$scope.list = {};
	$scope.list.listItem = [];
	$scope.category = "all";	
	$scope.checkedArray = [];
	$scope.startDate = "";
        $scope.current = 1;
        $scope.params = {
            page : 1,
            limit: "10"
        };

	// get store category
	$scope.getStoreCategories = function(){          
          if ($scope.list.city === undefined || $scope.list.city ===null) {
            $scope.list.city = '';
          }
          
          servercalls.postData('/store/getCategoriesCityBasis/',{city:$scope.list.city}, function(err, cat){
            console.log("cat======newcategories",cat);
            if(cat.status.status == 200){
              $scope.categoryList = cat.data;                    
            }else{
              toastr.error("can't get store list");
            }
          })
	}
	// get store city
	$scope.getStoreCity = function(){
          servercalls.getData('/store/city', {}, function(err, city){
            if(city.status.status == 200){
                    $scope.cityList = city.data;
                    console.log("$scope.cityList",$scope.cityList);
            }else{
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
            console.log("========branch===",branch);
            if(branch.status.status == 200){              
              $scope.branchList = branch.data['rows'];       
              $scope.count = branch.data['totalRows'];              
            }else{
                    toastr.error("can't get store list");
            }
          })
	}
	// get branch id for listItem
	$scope.getBranchId = function(name){
          if(name){
            if($scope.list.listItem.indexOf(name) > -1){
                    $scope.list.listItem.splice($scope.list.listItem.indexOf(name),1);
            }else{
                    $scope.list.listItem.push(name);
            }                  
          }
	}
        
	$scope.getFilterBranch = function(){
                
          $scope.current = 1;
          $scope.params.page = 1;
          $scope.getBranch();
          $scope.getStoreCategories();
	}
	// Add new list
	$scope.addOrUpdateList = function(){          
          var error=0;
          var listName = ($scope.list.listName!==undefined) ? $scope.list.listName.trim() : '';
          var city = ($scope.list.city!==undefined) ? $scope.list.city.trim() : '';
          var startDate = ($scope.list.startDate!==undefined) ? $scope.list.startDate.trim() : '';         
          var endDate = ($scope.list.endDate!==undefined) ? $scope.list.endDate.trim() : '';
          var listItem = ($scope.list.listItem!==undefined) ? $scope.list.listItem : '';
          
          
          
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
              if (new Date(startDate) < new Date(Date.now())){
                error = 1;
                toastr.error('Please select a valid date');
              }
              else if (new Date(startDate) > new Date(endDate)) {
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
              listItem : listItem
            }            
            servercalls.postData('/feature', data, function(err, newList){
                    if(newList && newList.status.status == 200){
                            toastr.success(newList.status.message);
                            $state.go('dashboard.feature');
                    }else{
                            toastr.error(err.status.message);
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

        
        
	$scope.getBranch();
	$scope.getStoreCategories();
	$scope.getStoreCity();
        
}).directive('timepicker', [

  function() {
    var link;
    link = function($scope, element, attr, ngModel) {
      
        var currentDate = new Date();           
        var month = currentDate.getMonth() + 1;
        var day = currentDate.getDate();
        var year = currentDate.getFullYear();
        //console.log(scope[attr.ngModel]);
        element = $(element);
        element.datetimepicker({
          //minDate: new Date(),
          minDate: moment(month+"/"+day+"/"+year, "MM/DD/YYYY"),      
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
           //alert($scope.list.startDate);
            //$scope.list.startDate = $("#timepicker1").val();
            //$scope.list.endDate = $("#timepicker2").val();
           //$(this).data('DateTimePicker').hide();
        });
    };
    return {
      restrict: 'A',
      link: link,
      require: 'ngModel'
    };
  }
])
