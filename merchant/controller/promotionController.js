app.controller('promotionController', function ($scope, constantUrl, servercalls, $state, $rootScope, toastr, $window, $filter) {
	//check user login session
	(function () {
		if (!$window.localStorage.getItem('id')) {
			$state.go('login');
		}
	})();
	$scope.promotion = {}
	$scope.promotionList = []
	$scope.current = 1;
	$scope.BASEURL = constantUrl.BASE_URL;
	$scope.params = {
		page: 1,
		limit: "10"
	};

	/**
	 *@fetchPromotions  
	 */
	$scope.fetchPromotions = function () {
		servercalls.getData('/promotion/fetchPromotionRequest/' + $scope.params.limit + '/' + $scope.params.page, {}, function (err, data) {
			console.log("data", data);
			$scope.promotionList = [];
			if (err) {
				toastr.error(err.status.message);
			} else if (data && data.status.status == 200) {
				if (data.data['rows'] !== undefined && data.data['rows'].length > 0) {
					$scope.promotionList = data.data['rows'];
					console.log("$scope.promotionList", $scope.promotionList);
					$scope.count = data.data['totalRows'];
				}
			}
		})
	}

	/**
	 *@pageChangeHandler paging content
	 */
	$scope.pageChangeHandler = function (pageNumber) {
		if (pageNumber) {
			$scope.params.page = pageNumber;
			$scope.fetchPromotions();
		}
	}


	$scope.fileChanged = function ($event) {

		var files = $event.target.files;
		console.log("files", files);
		$scope.promotion['storeImage'] = files[0];
		//    $scope.storeLogo= files[1];
	}

	/**
	 *@saveData   
	 */
	$scope.saveData = function () {
		console.log("promotionInfo");
		var where = {
			storeId: $window.localStorage.getItem('id'),
			"requestType": "promotionInfo",
			promotionName: $scope.promotion.promotionName
		}
		servercalls.postData('/request/fetch', where, function (err, data) {

			if (data.status.status != 200) {
				console.log("promotionInfo2");
				var error = 0;
				var startDate = '';
				var endDate = '';
				var promotionName = ($scope.promotion.promotionName !== undefined) ? $scope.promotion.promotionName.trim() : '';
				var originalValue = ($scope.promotion.originalValue !== undefined) ? $scope.promotion.originalValue : '';
				var offerValue = ($scope.promotion.offerValue !== undefined) ? $scope.promotion.offerValue : '';
				var startDate = ($scope.promotion.startDate !== undefined) ? $scope.promotion.startDate : '';
				var endDate = ($scope.promotion.endDate !== undefined) ? $scope.promotion.endDate : '';

				if ($scope.promotion.startDate.trim()) {
					startDate = $scope.promotion.startDate.trim().split("/");
					startDate = startDate[2] + "/" + startDate[0] + "/" + startDate[1];
				}
				if ($scope.promotion.endDate.trim()) {
					endDate = $scope.promotion.endDate.trim().split("/");
					endDate = endDate[2] + "/" + endDate[0] + "/" + endDate[1];
				}

				if (promotionName == '' || originalValue == '' || offerValue == '' || startDate == '') {
					error = 1;
					toastr.error('Please fill all required fields!');
				} else if (startDate && endDate) {
					if (new Date(startDate) > new Date(endDate)) {
						error = 1;
						toastr.error('End date should be equal or greater than the start date!');
					}
				}
				if (error == 0) {
					var postObject = new FormData();
					var promotionInfo = {};
					promotionInfo['promotionName'] = $scope.promotion.promotionName;
					promotionInfo['originalValue'] = $scope.promotion.originalValue;
					promotionInfo['offerValue'] = $scope.promotion.offerValue;
					promotionInfo['startDate'] = $scope.promotion.startDate;
					promotionInfo['endDate'] = $scope.promotion.endDate;
					promotionInfo = JSON.stringify(promotionInfo)
					postObject.append("storeId", $window.localStorage.getItem('id'));
					postObject.append("requestType", "promotionInfo");
					postObject.append("promotionName", $scope.promotion.promotionName);
							postObject.append("updateData", promotionInfo);
					postObject.append("storeImage", $scope.promotion.storeImage);
					//            postObject = {
					//            storeId : $window.localStorage.getItem('id'),
					//            "requestType" : "promotionInfo",
					//            promotionName : $scope.promotion.promotionName,
					//            updateData : { 
					//              'promotionInfo' : {
					//                promotionName : $scope.promotion.promotionName,
					//                originalValue : $scope.promotion.originalValue,
					//                offerValue : $scope.promotion.offerValue,
					//                startDate : $scope.promotion.startDate,
					//                endDate : $scope.promotion.endDate,
					//								storeImage: $scope.promotion.storeImage
					//								
					//              }
					//            }
					//          }    

					console.log(postObject, "----->postObject");
					servercalls.createStore('/request/', postObject, function (err, data) {
						if (err) {
							toastr.error("Something is wrong, please try after some time");
						} else {
							if (data.status.status == 200) {
								toastr.success(data.status.message);
								$('#myModal').modal('hide')
							} else {
								toastr.error(data.status.message);
							}
						}
					})
				}
			} else {
				toastr.error("This promotion name is already exist.");
			}
		});

	}

	/**
	 *@createExcelFile method is for exporting promotions data in excel file 
	 */
	$scope.createExcelFile = function () {

		servercalls.getData('/promotion/createExcelFileForPromotions', {}, function (err, data) {
			if (err) {
				toastr.error(err.status.message);
			} else if (data && data.status.status == 200) {
				$window.location.href = $scope.BASEURL + '/../uploads/promotions.xlsx';
			} else {
				toastr.error(data.status.message);
			}
		})
	}


	/** call below methods to be execute at the time page loding **/
	$scope.fetchPromotions();

})
