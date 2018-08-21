app.controller('productEditCtrl', ['$scope', '$state', 'http', function($scope, $state, http) {

    $scope.page = {
        name: 'Edit Products',
        id: '2'
    }
    $scope.$emit('page', $scope.page);
    
    /* Object for add product */
    $scope.data = {};
    $scope.categoryList={};
    $scope.product="";

    var productOffer = {
    		quantity : '',
    		perPrice : '',
            totalPrice: ''
    	};

    /* Get category */
    $scope.getCategories = function(){
        $scope.isLoading = true;
        http.getCategories().then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                $scope.categoryList = res.data.result;
                $scope.getProductDetails();
            } else {
                alert(res.message);
            }
        });
    }

    /* Get product detail */   
    $scope.getProductDetails = function() {        
        $scope.isLoading = true;
        http.getProductDetails($scope.data).then(function(res) {
            $scope.isLoading = false;
            if (!res.error) {
                $scope.productDetail = res.data.result.productDetals;  
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
    		$scope.offers.push({quantity: '', perPrice : '', totalPrice: ''});
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

     $scope.data = {
        product_id : parseInt($state.params.id)
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
