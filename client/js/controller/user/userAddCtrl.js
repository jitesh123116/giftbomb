app.controller('userAddCtrl', function($scope,servercalls,$state,$rootScope,toastr,$window){
	(function(){
          if(!$window.localStorage.getItem('adminSession')){
              $state.go('login');
          }
        })();
        $scope.user = {};              
        /**
         * 
         * @returns {undefined}
         */      
	$scope.addUser = function(){
          var cookieData = JSON.parse($window.localStorage.getItem('adminSession'));        
          var fname = ($scope.user.fname!==undefined) ? $scope.user.fname.trim() : '';
          var lname = ($scope.user.lname!==undefined) ? $scope.user.lname.trim() : '';
          var gender = ($scope.user.gender!==undefined) ? $scope.user.gender.trim() : '';
          var dob = ($scope.user.dob!==undefined) ? $scope.user.dob.trim() : '';
          var countryCode = ($scope.countryCode!==undefined) ? $scope.countryCode.trim() : '';
          var phoneNumber =  ($scope.phoneNumber!==undefined) ? $scope.phoneNumber : '';
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
            servercalls.postData('/user/create/'+cookieData._id, params, function(err, data){
              if(data.status.status == 200){     
                $state.go('dashboard.user');
                toastr.success(data.status.message);
                console.log("fsdf");
              }else{
                toastr.error(data.status.message);
              }
            })
          }else{
            toastr.error("Please fill all required fields.");
          }      
	}
})