var app = angular.module('giftbomb',['ui.router','ui.bootstrap','toastr','angularUtils.directives.dirPagination']);
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

app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});


app.config(function($stateProvider,$urlRouterProvider,$locationProvider){
	$urlRouterProvider.otherwise('/login');
	$stateProvider
	.state('dashboard', {
		url : '/dashboard',
		templateUrl : "/screens/dashboard.html",
		controller : "dashboardCtrl"
	})
	.state('login', {
		url : '/',
		templateUrl : "/screens/login.html",
		controller : "loginCtrl"
	})
        
        .state('logout', {
		url : '/logout',
		//templateUrl : "",
		controller : "logoutCtrl"
	})
        
	.state('forgot', {
		url : '/forgot',
		templateUrl : "/screens/forgot.html",
		controller : "forgotCtrl"
	})
        
	.state('reset', {
		url : '/reset/:id/:code',
		templateUrl : "/screens/reset.html",
		controller : "changePasswordCtrl"
	})
        .state('dashboard.newpassword', {
		url : '/newpassword',
		templateUrl : "/screens/new_password.html",
		controller : "resetCtrl"
	})
        
	.state('dashboard.user', {
		url : 'user',
		templateUrl : "/screens/user/userList.html",
		controller : "userListCtrl"
	})
	.state('dashboard.userAdd', {
		url : 'user/add',		
		templateUrl : "/screens/user/userAdd.html",
		controller : "userAddCtrl"
	})
	.state('dashboard.userEdit', {
		url : 'user/edit',
		params:{user:undefined},
		templateUrl : "/screens/user/userEdit.html",
		controller : "userEditCtrl"
	})
        .state('dashboard.userView', {
		url : 'user/view/:id',
		templateUrl : "/screens/user/userView.html",
		controller : "userViewCtrl"
	})
	
	.state("dashboard.userPayment",{
		
		url:"userpayment",
		templateUrl:"/screens/payment/payment.html",
		controller:"paymentViewCtrl"
	})
        
        
	.state('dashboard.feature', {
		url : 'feature',
		templateUrl : "/screens/feature/feature.html",
		controller : "featureCtrl"
	})
	.state('dashboard.featureAdd', {
		url : 'feature/add',
		templateUrl : "/screens/feature/featureAdd.html",
		controller : "featureAddCtrl"
	})
	.state('dashboard.featureView', {
		url : 'feature/view/:id',
		templateUrl : "/screens/feature/featureView.html",
		controller : "featureViewCtrl"
	})
	.state('dashboard.featureEdit', {
		url : 'feature/edit/:id',
		templateUrl : "/screens/feature/featureEdit.html",
		controller : "featureEditCtrl"
	})
	.state('dashboard.store', {
		url : 'store',
		templateUrl : "/screens/store/store.html",
		controller : "storeCtrl"
	})
	.state('dashboard.storeAdd', {
		url : 'store/add',
		templateUrl : "/screens/store/storeAdd.html",
		controller : "storeAddCtrl"
	})
	.state('dashboard.storeView', {
		url : 'store/view/:id',
		templateUrl : "/screens/store/storeView.html",
		controller : "storeViewCtrl"
	})
	.state('dashboard.storeEdit', {
		url : 'store/edit/:sid',
		templateUrl : "/screens/store/storeEdit.html",
		controller : "storeEditCtrl"
	})
  .state('dashboard.redumptions', {
		url : 'redumptions',
		templateUrl : "/screens/redumptions/redumptions.html"
		//controller : "storeCtrl"
	})
	.state('dashboard.branchAdd', {
		url : 'branch/add',
		templateUrl : "/screens/branch/branchAdd.html",
		controller : "branchAddCtrl"
	})
	.state('dashboard.location', {
		url : 'location',
		templateUrl : "/screens/location/location.html",
		controller : "locationCtrl"
	})
	.state('dashboard.request', {
		url : 'request',
		templateUrl : "/screens/request/request.html",
		controller : "requestCtrl"
	})
	.state('dashboard.requestView', {
		url : 'request/viewRequest',
		params:{id:undefined,method:undefined},
		templateUrl : "/screens/request/requestView.html",
		controller : "requestCtrl"
	})
    .state('dashboard.searchRequest',{
		url : 'searchRequest',
		templateUrl : "/screens/search_requests.html",
		controller : "searchRequestCtrl"
	})
	.state('dashboard.searchCountryRequest',{
		url : 'searchCountryRequest',
		templateUrl : "/screens/country_requests.html",
		controller : "countryRequestCtrl"
	})
	.state("dashboard.promotions",{
		
		url:"promotions",
		templateUrl:"/screens/promotions/promotions.html",
		controller:"promotionsCntrl"
	})
	.state("dashboard.notifications",{
		
		url:"notifications",
		templateUrl:"/screens/notifications/notifications.html",
		controller:"notificationsCntrl"
	})
        
	.state('otherwise', {
          url: "*path",
          templateUrl : "/screens/page-not-found.html",   
        })
})

// Toaster configuration
app.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    autoDismiss: true,
    containerId: 'toast-container',
    maxOpened: 2,    
    newestOnTop: true,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
   	preventOpenDuplicates: false,
    target: 'body'
  });
});





app.run(function($rootScope){
  
  if(window.localStorage.getItem('adminSession')){
   $rootScope.loginStatus = true;
  }
})
