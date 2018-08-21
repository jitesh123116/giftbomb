app.controller('branchAddCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
	$scope.storeList = {};
	$scope.store = {};
	$scope.branch = {};
	$scope.searchText = '';
	$scope.countryList = [];
	$scope.cityList = [];
        $scope.choices =[];
	
	// get country list
	$scope.getCoutryList = function(){
		servercalls.getData('/country', {}, function(err,data){
			if(data.status.status == 200){
				data.data.forEach(function(item){
					$scope.countryList.push(item.name);
					//$scope.branch.country = $scope.countryList[0];
				})
			}
		})
	}
	$scope.getCoutryList();
	$scope.createBranch = function(){
		console.log("branchCreate",$scope.branch);
		servercalls.postData('/store/branch', $scope.branch, function(err, branchCreate){
			if(err){
				toastr.error(err.error);
			}else	if(branchCreate.status.status == 200){
				toastr.success(branchCreate.status.message);
				$state.go('dashboard.store');
			}
		})
	}
        
        
        $scope.getCityInCountry = function(name){
        servercalls.getData('/country/'+name+'/city', {}, function(err, city){
                if(city.status.status == 200){                        
                        $scope.cityList = city.data[0].city;                        
                }
        })
        }
        
        /**
         * 
         */        
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
        
        
       
       
    /**
     * 
     * @This is autocomplete search
     */
    new autoComplete({
          selector: '#search',
          minChars: 1,
          source: function(term, suggest){
            $scope.choices =[];
            if($scope.search!==undefined && $scope.search.trim()){
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
                if(data.status.status == 200){
                  $scope.store = data.data[0];               
                  $scope.branch.storeId = data.data[0]._id;
                }
              })
            }
          }
      }); 
    
    
    
    /**
     *@ This is for fetching the data for the autocomplete array 
     * @returns {undefined}
     */
    $scope.setSerachData = function(){
      
      /*
      $scope.choices =[];
      if($scope.search!==undefined && $scope.search.trim()){
        servercalls.getData('/store/search', {"storeName":$scope.search}, function(err, data){
          if(data.status.status == 200){
            for(var i=0; i<data.data.length;i++){
               $scope.choices.push( data.data[i].accountInfo['storeName']);                 
            }
          }
        })
      }
      */
    }     
})