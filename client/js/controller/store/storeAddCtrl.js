app.controller('storeAddCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window,$http){
  
  $scope.storeList = {};
  $scope.countryList = [];
  $scope.cityList = [];
  $scope.store = {};
  $scope.store.contact = {};
  $scope.store.branch = {};
  $scope.store.branch.timing = {};
  
  
  
  // get country list
  $scope.getCoutryList = function(){
    servercalls.getData('/country', {}, function(err,data){
      if(data.status.status == 200){
        data.data.forEach(function(item){
                $scope.countryList.push(item.name);
        })
      }
    })
  }
  
  
  // get country list
  $scope.getCityList = function(){
    servercalls.getData('/country/fetchCityList', {}, function(err,data){
      if(data.status.status == 200){
        data.data.forEach(function(item){          
          item.city.forEach(function(cityName){          
            $scope.cityList.push(cityName);
          })
        })
      }
    })
  }
  $scope.getCityList();
  
  
  // get country list
  $scope.getCityInCountry = function(name){
        servercalls.getData('/country/'+name+'/city', {}, function(err, city){
                if(city.status.status == 200){                        
                        $scope.cityList = city.data[0].city;
                        console.log("$scope.cityList", $scope.cityList);
                }
        })
  }
  

  // add store
  $scope.addStore = function(){
    
    var website = ($scope.store.website!==undefined) ? $scope.store.website : '';
    var tagLine = ($scope.store.tagLine!==undefined) ? $scope.store.tagLine : '';   
    
    var payload = new FormData();
    payload.append("storeName", $scope.store.storeName);
    payload.append("category", $scope.store.category);
    payload.append("website", website);
    payload.append("tagLine", tagLine);
    payload.append("country", $scope.store.country);
    //payload.append("state", $scope.store.state);
    payload.append("firstName", $scope.store.contact.firstName);
    payload.append("lastName", $scope.store.contact.lastName);
    payload.append("contactNumber", $scope.store.contact.contactNumber);
    payload.append("email", $scope.store.contact.email);
    payload.append("branchlocationName", $scope.store.branch.locationName);
    payload.append("branchphoneNumber", $scope.store.branch.phoneNumber);
    payload.append("branchstate", $scope.store.branch.state);
    //payload.append("branchcountry", $scope.store.branch.country);
    payload.append("branchcity", $scope.store.branch.city);
    payload.append("branchpincode", $scope.store.branch.pincode);
    payload.append("branchlat", $scope.store.branch.lat);
    payload.append("branchlon", $scope.store.branch.lon);
    payload.append("branchaddress", $scope.store.branch.address);
    payload.append('storeImage', $scope.storeImage);
	  payload.append("storeLogo",$scope.storeLogo);
    //servercalls.postData('/store', payload, function(err, response){
    servercalls.createStore('/store', payload, function(err, response){
      console.log("err",err);
      console.log("response",response);
      if(response.status.status == 200){
              $state.go('dashboard.store');
              toastr.success(response.status.message);
      }else{
              toastr.error(response.status.message);
      }
    })
  }
  
  $scope.fileChanged = function($event) {    
    var files = $event.target.files;    
    $scope.storeImage = files[0];
//    $scope.storeLogo= files[1];
  }
  
	
	$scope.fileChanged1 = function($event) {    
    var files = $event.target.files;    
    $scope.storeLogo = files[0];
 
  }
  
  $scope.getCoutryList();
})




