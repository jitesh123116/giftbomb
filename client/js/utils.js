app.factory('servercalls', ['$http','constantUrl', function($http,constantUrl){
	return {
		getData : function(url,filters,cb){
			return $http.get(constantUrl.BASE_URL+url+"?query="+JSON.stringify(filters),{withCredentials: true})
				.success(function(data){ return cb(null,data);})
				.error(function(err){return cb(err,null);})
		},
		putData : function(url,data,cb){
			$http.put(constantUrl.BASE_URL+url , data,{withCredentials: true})
				.success(function(data){ return cb(null,data);})
				.error(function(err){return cb(err,null);})
		},
		postData : function(url,data,cb){
			$http.post(constantUrl.BASE_URL+url, data,{withCredentials: true})
				.success(function(data){ return cb(null,data);})
				.error(function(err){return cb(err,null);})
		},
		deleteData: function(url,cb){
			$http.delete(constantUrl.BASE_URL+url , {withCredentials: true})
				.success(function(data){ return cb(null,data);})
				.error(function(err){return cb(err,null);})
		},
                createStore:function(url,data,cb){
                  var req = {                                                        
                    method: 'POST',
                    url: constantUrl.BASE_URL+url,
                    headers: { 'Content-Type': undefined},
                    data: data
                  }

                  $http(req).then(function(data){
                    return cb(null,data.data);
                  }, function(err){
                    return cb(err.data, null);
                  });
                },
                
                editStore:function(url,data,cb){
                  var req = {                                                        
                    method: 'POST',
                    url: constantUrl.BASE_URL+url,
                    headers: { 'Content-Type': undefined},
                    data: data
                  }

                  $http(req).then(function(data){
                    return cb(null,data.data);
                  }, function(err){
                    return cb(err.data, null);
                  });
                },
                createRequest:function(url,data,cb){
                  var req = {                                                        
                    method: 'POST',
                    url: constantUrl.BASE_URL+url,
                    headers: { 'Content-Type': undefined},
                    data: data
                  }

                  $http(req).then(function(data){
                    return cb(null,data.data);
                  }, function(err){
                    return cb(err.data, null);
                  });
                },
                editRequest:function(url,data,cb){
                  var req = {                                                        
                    method: 'POST',
                    url: constantUrl.BASE_URL+url,
                    headers: { 'Content-Type': undefined},
                    data: data
                  }

                  $http(req).then(function(data){
                    return cb(null,data.data);
                  }, function(err){
                    return cb(err.data, null);
                  });
                },
                
	};

}])


