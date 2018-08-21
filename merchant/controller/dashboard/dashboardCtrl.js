app.controller('dashboardCtrl', ['$scope', '$rootScope', '$cookieStore', '$state', '$location', 'http', 'auth', function($scope, $rootScope, $cookieStore, $state, $location, http, auth) {

    angular.element('body').removeClass('bg');


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name == 'dashboard') {
            $state.go('dashboard.products');
        }
    })

    /**
     *Get admin login detail
     */
    if ($cookieStore.get('indHerbs')) {
        $scope.user = $cookieStore.get('indHerbs');
    }



    /**
     *change state
     */
    if ($state.current.name == 'dashboard') {
        $state.go('dashboard.products');
    }


    /**
     *Get active page
     */
    $scope.$on('page', function(evnt, data) {
        $scope.page = data;
    });


    /**
     *Logout
     */
    $scope.logout = function() {
        auth.clear();
        $location.path('/login');
    }


    /**
     *Object for change password api
     */
    $scope.changePassword = {
        user_id: $scope.user.user_id
    };

    /**
     *Change password
     */
    $scope.resetPassword = function() {
        $scope.isLoading = true;
        http.userResetPassword($scope.changePassword).then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                if (res.data.errorCode == 1) {
                    $scope.messageChangePassword = false;
                    $scope.messageLogin = false;
                    $scope.messageLoginSuccess = res.data.errorMessage;
                    angular.element('#changePasswordModal').modal('hide');
                } else {
                    $scope.messageForgotPassword = res.data.errorMessage;
                }
            } else {
                alert(res.message);
            }
        });
    }


}]);
