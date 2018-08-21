app.factory('auth', ['$cookieStore', function($cookieStore) {
    return {
        set: function(data) {
            $cookieStore.put('indHerbs', data);
        },
        get: function() {
            return $cookieStore.get('indHerbs');
        },
        clear: function() {
            $cookieStore.remove('indHerbs');
        }
    }
}]);
