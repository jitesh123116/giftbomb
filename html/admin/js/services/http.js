app.factory('http', ['Upload', '$http', function(Upload, $http) {

    var url = 'http://indianhub.w3studioz.com:3000/';

    var service = {};

    service.login = login;
    service.forgetPassword = forgetPassword;
    service.userResetPassword = userResetPassword;
    service.getProductList = getProductList;
    service.getProductDetails = getProductDetails;
    service.createProduct = createProduct;
    service.getCategories = getCategories;
    service.addCategories = addCategories;
    service.getUserList = getUserList;

    return service;

    //Login
    function login(data) {
        return $http.post(url + 'users/usersLogin', data).then(handleSuccess, handleError('Error'));
    }

    //Forget Password
    function forgetPassword(data) {
        return $http.post(url + 'users/forgetPassword', data).then(handleSuccess, handleError('Error'));
    }

    //Reset Password
    function userResetPassword(data) {
        return $http.post(url + 'users/userResetPassword', data).then(handleSuccess, handleError('Error'));
    }


    //Get Product List
    function getProductList(data) {
        return $http.post(url + 'product/getProductList', data).then(handleSuccess, handleError('Error'));
    }


    //Get Product detail
    function getProductDetails(data){
        return $http.post(url + 'product/getProductDetails', data).then(handleSuccess, handleError('Error'));
    }

    //createProduct
    function createProduct(data){
        data.image.upload = Upload.upload({
                method: 'POST',
                url: url + 'product/createProduct',
                data: data
            });
            return data.image.upload.then(handleSuccess, handleError('Error'));
    }


     //Get Product category
    function getCategories(){
        return $http.get(url + 'product/getCategories').then(handleSuccess, handleError('Error'));
    }

    //addCategories
    function addCategories(data){
        return $http.post(url + 'product/addCategories',data).then(handleSuccess, handleError('Error'));
    }


    // get user list
    function getUserList(data){
        return $http.post(url + 'users/getUserList',data).then(handleSuccess, handleError('Error'));
    }


    // private functions
    function handleSuccess(response) {
        return response;
    }

    function handleError(error) {
        return function() {
            return { error: true, message: error };
        };
    }
}]);
