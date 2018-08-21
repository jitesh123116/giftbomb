app.controller('locationCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
  
  (function(){
    if(!$window.localStorage.getItem('adminSession')){
        $state.go('login');
    }
  })();
  
  $scope.current = 1;
  $scope.params = {
      page : 1,
      limit: "10"
  };
  //for cities
  $scope.currentCity = 1;
  $scope.paramsCity = {
      page : 1,
      limit: "10"
  };
  
  $scope.countryList = [];
  $scope.countryDropDownList = [];
  $scope.cityList = [];
  $scope.country = {};
  $scope.city = {};
  
  /**
   *@getCountryList
   */
  $scope.getCountryList = function(){
    servercalls.getData('/country/getAllCountryData', $scope.params, function(err, country){
      if(country.status.status == 200){
        console.log("country",country);
        $scope.countryList = country.data['rows'];
        $scope.count = country.data['totalRows'];
        
      }
    })
  }  
  $scope.getCountryList();	
  
  /**
   * 
   * @param {type} id
   * @returns {undefined}
   */
  $scope.getCountryDropDownList = function(){
    servercalls.getData('/country', $scope.params, function(err, country){
      if(country.status.status == 200){       
        $scope.countryDropDownList = country.data;
      }
    })
  }  
  $scope.getCountryDropDownList();
  
  

  $scope.addCountry = function(id){
    servercalls.postData('/country', $scope.country, function(err, newCountry){
            if(newCountry.status.status == 200){
                    toastr.success(newCountry.status.message);
                    $scope.getCountryList();
                    window.location.reload();
            }
    })
  }

	$scope.addCity = function(id){
		console.log("city",$scope.city);
		servercalls.postData('/country/city/add', $scope.city, function(err, newCity){
                        if(err){
                          toastr.error(err.error);
                        }else{
                          if(newCity.status.status == 200){
				toastr.success(newCity.status.message);
				window.location.reload();
                          }else{
                            toastr.error(newCity.status.message);
                          }
                        } 
		})
	}
        
        
         $scope.deleteCountry = function(id){
                
                if (confirm("Are you sure to delete this country?") == true) {
          
                    console.log("=====deleteCountry",id);
                    servercalls.postData('/country/deleteCountry/'+id, {}, function(err, newCity){
                            if(newCity.status.status == 200){
                                    toastr.success(newCity.status.message);
                                    window.location.reload();
                            }
                    })
                  }    
	}
        
        
        $scope.deleteCity = function(city){
                
                if (confirm("Are you sure to delete this city?") == true) {
          
                    
                    servercalls.postData('/country/deleteCity/'+city, {}, function(err, newCity){
                            if(newCity.status.status == 200){
                                    toastr.success(newCity.status.message);
                                    window.location.reload();
                            }
                    })
                  }    
	}
        
  /**
   * 
   */        
  $scope.getCityList = function(){
    servercalls.getData('/country/getAllCities', $scope.paramsCity, function(err,data){ 
      $scope.cityList=[]; 
      $scope.totalCities = 0;
      if(data.status.status == 200 && data.data['rows'].length>0){     
        $scope.cityList= data.data['rows'][0].city;
        $scope.totalCities= data.data['totalRows'][0].total_sum;        
      }
    })
  }
  
 
  /**
  * get paging content
  */
  $scope.pageChangeHandler = function(pageNumber) {
      console.log("pageNumber", pageNumber); 
      if (pageNumber) {
          $scope.params.page = pageNumber;
          $scope.getCountryList();
      }
  }
  
  /**
  * get paging content
  */
  $scope.pageChangeHandlerForCity = function(pageNumber) {
      console.log("pageNumber", pageNumber); 
      if (pageNumber) {
          $scope.paramsCity.page = pageNumber;
          $scope.getCityList();
      }
  }
  
  $scope.fetchCitiesOnCountryBasis = function() {
    $scope.currentCity = 1;
    $scope.paramsCity.page = 1;
    $scope.paramsCity.name = $scope.countryName;
    $scope.getCityList();
  }
  
  
  $scope.getCityList();
        
})