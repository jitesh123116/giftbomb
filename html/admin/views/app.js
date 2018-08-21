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
        .state('userList', {
            url: "/userList",
            views: { "page": { templateUrl: "views/users/user_list.html" } }
        })
        .state('userView', {
            url: "/userView",
            views: { "page": { templateUrl: "views/users/user_view.html" } }
        })
        .state('userEdit', {
            url: "/userEdit",
            views: { "page": { templateUrl: "views/users/user_edit.html" } }
        })
        .state('promotion', {
            url: "/promotion",
            views: { "page": { templateUrl: "views/promotions/promotion.html" } }
        })
        .state('request', {
            url: "/request",
            views: { "page": { templateUrl: "views/request/request_list.html" } }
        })
        .state('requestDesign', {
            url: "/requestDesign",
            views: { "page": { templateUrl: "views/request/requested_design.html" } }
        })
        .state('requestPayment', {
            url: "/requestPayment",
            views: { "page": { templateUrl: "views/request/requested_payment.html" } }
        })
        .state('requestPromotion', {
            url: "/requestPromotion",
            views: { "page": { templateUrl: "views/request/requested_Promotion.html" } }
        })
        .state('requestStoreInfo', {
            url: "/requestStoreInfo",
            views: { "page": { templateUrl: "views/request/requested_store_info.html" } }
        })
        .state('notification', {
            url: "/notification",
            views: { "page": { templateUrl: "views/notification/notification.html" } }
        })
        .state('payment', {
            url: "/payment",
            views: { "page": { templateUrl: "views/payment/payment.html" } }
        })
        .state('storeList', {
            url: "/storeList",
            views: { "page": { templateUrl: "views/store_list/store_list.html" } }
        })
        .state('storeAdd', {
            url: "/storeAdd",
            views: { "page": { templateUrl: "views/store_list/store_add.html" } }
        })
        .state('storeView', {
            url: "/storeView",
            views: { "page": { templateUrl: "views/store_list/store_view.html" } }
        })
        .state('storeEdit', {
            url: "/storeEdit",
            views: { "page": { templateUrl: "views/store_list/store_edit.html" } }
        })
        .state('branchAdd', {
            url: "/branchAdd",
            views: { "page": { templateUrl: "views/store_list/branch_add.html" } }
        })
        .state('featureList', {
            url: "/featureList",
            views: { "page": { templateUrl: "views/feature_list/feature_list.html" } }
        })
        .state('featureAdd', {
            url: "/featureAdd",
            views: { "page": { templateUrl: "views/feature_list/feature_add.html" } }
        })
        .state('featureEdit', {
            url: "/featureEdit",
            views: { "page": { templateUrl: "views/feature_list/feature_edit.html" } }
        })
        .state('featureListView', {
            url: "/featureListView",
            views: { "page": { templateUrl: "views/feature_list/feature_list_view.html" } }
        })
        .state('searchRequest', {
            url: "/searchRequest",
            views: { "page": { templateUrl: "views/search_requests/search_requests.html" } }
        })
        .state('location', {
            url: "/location",
            views: { "page": { templateUrl: "views/location/location.html" } }
        })
        .state('redemption', {
            url: "/redemption",
            views: { "page": { templateUrl: "views/redemption/redemption.html" } }
        });
//        .state('merchantRedemption', {
//            url: "/merchantRedemption",
//            views: { "page": { templateUrl: "views/merchant/redemption/redemption.html" } }
//        })
//
//        .state('merchantPromotion', {
//            url: "/merchantPromotion",
//            views: { "page": { templateUrl: "views/merchant/promotion/promotion.html" } }
//        })
//
//        .state('merchantStore', {
//            url: "/merchantStore",
//            views: { "page": { templateUrl: "views/merchant/manageStore/manageStore.html" } }
//        })
//
//        .state('merchantDesign', {
//            url: "/merchantDesign",
//            views: { "page": { templateUrl: "views/merchant/manageDesign/manageDesign.html" } }
//        });
        
}]);



