var app = angular.module('giftbomb',['ui.router','ui.bootstrap','toastr','angularUtils.directives.dirPagination']);
app.constant('constantUrl', {'BASE_URL':'http://localhost:3000'});


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
	$urlRouterProvider.otherwise('/anot');
	$stateProvider
	.state('anot', {
		url : '/anot',
		templateUrl : "../anotDemo.html",
		controller : "storeCtrl"
	})
	.state('dashboard.store', {
		url : 'store',
		templateUrl : "/screens/store/store.html",
		controller : "storeCtrl"
	})   
	.state('otherwise', {
          url: "*path",
		  templateUrl : "/screens/store/store.html", 
		  controller : "storeCtrl"  
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
