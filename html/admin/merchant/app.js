var app = angular.module('indianHerbsApp', [
    'ui.router'
]);

app.config(['$stateProvider', '$urlRouterProvider',  function($stateProvider,  $urlRouterProvider ) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('login', {
            url: "/",
            views: { "page": { templateUrl: "views/login/login.html" } }            
        })
        .state('forgotPassword', {
            url: "/forgotPassword",
            views: { "page": { templateUrl: "views/login/forgot_password.html" } }
        })
        .state('newPassword', {
            url: "/newPassword",
            views: { "page": { templateUrl: "views/login/new_password.html" } }
        })

        .state('dashboard', {
            url: "/dashboard",
            views: { "page": { templateUrl: "views/dashboard/dashboard.html" } }
        })

        .state('manageRedemption', {
            url: "/manageRedemption",
            views: { "page": { templateUrl: "views/redemption/redemption.html" } }
        })

        .state('promotion', {
            url: "/promotion",
            views: { "page": { templateUrl: "views/promotion/promotion.html" } }
        })

        .state('manageStore', {
            url: "/manageStore",
            views: { "page": { templateUrl: "views/manageStore/manageStore.html" } }
        })

        .state('manageDesign', {
            url: "/manageDesign",
            views: { "page": { templateUrl: "views/manageDesign/manageDesign.html" } }
        });
        
}]);



