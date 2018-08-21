var app = angular.module('merchantApp', ['ui.router','ui.bootstrap','toastr','angularUtils.directives.dirPagination']);
//app.constant('constantUrl', {'BASE_URL':'http://localhost:3000'});
app.constant('constantUrl', {'BASE_URL':'http://54.152.168.199:3000'});

app.directive("ngUploadChange",function(){  
    return{
        scope:{
            ngUploadChange:"&"
        },
        link:function($scope, $element, $attrs){
            $element.on("change",function(event){
                $scope.ngUploadChange({$event: event})
            })
            $scope.$on("$destroy",function(){
                $element.off();
            });
        }
    }
});

app.config(['$stateProvider', '$urlRouterProvider',  function($stateProvider,  $urlRouterProvider ) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('login', {
          url: "/",
          views: { "page": { templateUrl: "views/login/login.html",controller : "register" } }
            
        })   
        
        .state('logout', {
          url: "/logout",
          views: { "page": { controller : "logoutCtrl" } }
            
        })  
        
         .state('forgot', {
            url: "/forgot",
            views: { "page": { templateUrl: "views/login/forgot_password.html",controller : "forgotCtrl" } }
            
        })
                        
        .state('reset', {
            url: "/reset/:id/:code",
            views: { "page": { templateUrl: "views/login/reset.html",controller : "resetCtrl" } }
            
        })
        
        .state('newPassword', {
            url: "/newPassword",
            views: { "page": { templateUrl: "views/login/new_password.html",controller : "changePasswordCtrl" } }
        })
        .state('dashboard', {
            url: "/dashboard",
            views: { "page": { templateUrl: "views/dashboard/dashboard.html",controller : "dashboardCtrl" } }
        })
        .state('manageRedemption', {
            url: "/manageRedemption",
            views: { "page": { templateUrl: "views/redemption/redemption.html",controller : "redemptionCtrl" } }
        })

        .state('promotion', {
            url: "/promotion",
            views: { "page": { templateUrl: "views/promotion/promotion.html",controller : "promotionController" } }
        })
        .state('manageStore', {
            url: "/manageStore",
            views: { "page": { templateUrl: "views/manageStore/manageStore.html",controller : "storesController" } } 
        })
        .state('manageStoreEdit', {
            url: "/manageStoreEdit",
            views: { "page": { templateUrl: "views/manageStore/manageStoreEdit.html" } } 
        })

        .state('manageDesign', {
            url: "/manageDesign",
            views: { "page": { templateUrl: "views/manageDesign/manageDesign.html",controller : "manageDesignController" } }
        });
        
}]);



