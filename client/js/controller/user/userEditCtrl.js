app.controller('userEditCtrl', function($scope,$filter,$window,servercalls,$state,$rootScope,toastr){
	(function(){
          if(!$window.localStorage.getItem('adminSession')){
              $state.go('login');
          }
        })();
  
        $scope.user = {};        
	if($state.params.user){          
          $scope.id = $state.params.user;
          servercalls.getData('/user/'+$scope.id, {}, function(err, data){
            if(data.status.status == 200){
              $scope.user = data.data[0];
              $scope.user.dob = $filter('date')(data.data[0].dob, "MM/dd/yyyy");
              $scope.user.phoneNumber = parseInt(data.data[0].phoneNumber);
            }else{
              $state.go('dashboard.user');
            }
          })
	}
        
        /**
         * 
         */
        
        $scope.updateUser = function(){
          if($scope.user!==undefined && $scope.user._id){ 
            
            var fname = ($scope.user.fname!==undefined) ? $scope.user.fname.trim() : '';
            var lname = ($scope.user.lname!==undefined) ? $scope.user.lname.trim() : '';
            var gender = ($scope.user.gender!==undefined) ? $scope.user.gender.trim() : '';
            var dob = ($scope.user.dob!==undefined) ? $scope.user.dob.trim() : '';
            var countryCode = ($scope.user.countryCode!==undefined) ? $scope.user.countryCode.trim() : '';
            var phoneNumber =  ($scope.user.phoneNumber!==undefined) ? $scope.user.phoneNumber : '';
            var email = ($scope.user.email!==undefined) ? $scope.user.email.trim() : '';
            if(dob){
              dob = dob.split("/");
              dob = dob[2]+"/"+dob[0]+"/"+dob[1];
            }

            if(fname!="" && lname!="" && gender!="" && dob!="" && countryCode!="" && phoneNumber!="" && email!=""){

              var params = {
                fname : fname,
                lname : lname,
                gender : gender,
                dob : dob,
                countryCode : countryCode,
                phoneNumber : phoneNumber,
                email : email
              };	
            }  
            
            
            servercalls.putData('/user/'+$scope.user._id, params, function(err, data){
              if(data.status.status == 200){
                $state.go('dashbord.user');
                toastr.success(data.status.message);
              }else{
                toastr.error(data.status.message);
              }
            })
          }else{
            $state.go('dashboard.user');
          }  
        }
        
})