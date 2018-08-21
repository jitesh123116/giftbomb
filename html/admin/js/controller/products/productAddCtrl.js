app.controller('productAddCtrl', ['$scope', '$state', 'http', function($scope, $state, http) {
    
    function wysiwygeditor($scope) {
		$scope.orightml = '<h2>Try me!</h2>';
		$scope.htmlcontent = $scope.orightml;
		$scope.disabled = false;
	};

    $scope.page = {
        name: 'Add Products',
        id: '2'
    }
    $scope.$emit('page', $scope.page);

    /* Object for add product */
    $scope.data = {};

    var productOffer = {
    		productQuantity : '',
    		productPrice : '',
            totalPrice:''
    	};

       

    /* Get category */
    $scope.getCategories = function(){
        $scope.isLoading = true;
        http.getCategories().then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                $scope.categoryList = res.data.result;         
            } else {
                alert(res.message);
            }
        });
    }
    /* Initialize getCategories function */
    $scope.getCategories();
    
    // add offer 
    $scope.offers = [];
    $scope.offers.push(productOffer);
    $scope.addOffer = function(){
    	if($scope.offers.length < 5){  		
    		$scope.offers.push({productQuantity: '', productPrice : '', totalPrice: ''});
            console.log($scope.offers.productQuantity);
    	}
    }
    // delete offer
    $scope.deleteOffer = function(index){
    	if($scope.offers.length > 1){
    		$scope.offers.splice(index,1);
    	}
    }

    /*Upload Profile Photo*/
    $scope.uploadProfile = function(file) {
        $scope.data.image = file;
        if (file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = $scope.imageIsLoaded;
        }
    }

    $scope.imageIsLoaded = function(e) {
        $scope.$apply(function() {
            $scope.profileUrl = e.target.result;
        });
    }

    // add product form submit
     $scope.productAdd = function(){
        $scope.data.productCatId = parseInt($scope.data.productCatId); 
        $scope.data.productOfferData = $scope.offers;
        console.log($scope.data); 

         return false;
        $scope.isLoading = true;
        http.createProduct($scope.data).then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                $state.go('dashboard.products');
            } else {
                alert(res.message);
            }
        });
    }



}]);
