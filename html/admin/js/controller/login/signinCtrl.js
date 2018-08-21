app.controller('signinCtrl', ['$scope', '$location', 'http', 'auth', function($scope, $location, http, auth) {

    angular.element('body').addClass('bg');

    /**
     *Object for login api
     */
    $scope.data = {
        type: 'application'
    };


    /**
     *signin
     */
    $scope.signin = function() {
        $scope.isLoading = true;
		//$location.path('/dashboard');
       http.login($scope.data).then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                if (res.data.errorCode == 1) {
                    $scope.messageLogin = false;
                    auth.set(res.data.result);
                    $location.path('/dashboard');
                } else {
                    $scope.messageLogin = res.data.errorMessage;
                }
            } else {
                alert(res.message);
            }
        }); 
    }

    /**
     *Object for forgot password api
     */
    $scope.forgot = {};

    /**
     *Forgot Password
     */
    $scope.forgetPassword = function() {
        $scope.isLoading = true;
        http.forgetPassword($scope.forgot).then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                if (res.data.errorCode == 1) {
                    $scope.messageForgotPassword = false;
                    $scope.messageLogin = false;
                    $scope.messageLoginSuccess = res.data.errorMessage;
                    angular.element('#forgotPasswordModal').modal('hide');
                } else {
                    $scope.messageForgotPassword = res.data.errorMessage;
                }
            } else {
                alert(res.message);
            }
        });
    }



}]);
