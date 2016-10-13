app.run(function ($rootScope, $location, $route, $http, localStorageService) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {


        //onLocationChange

        var nextPath = next.split('#')[1];
        var currentPath = current.split('#')[1];

        if (nextPath !== currentPath) {
            var history = localStorageService.get('history') === null ? [] : localStorageService.get('history');

            history.push(currentPath);

            localStorageService.set('history', history);
        }


        //http interceptor
        if (localStorageService.get('bearerToken')) {
            $rootScope.authData = localStorageService.get('bearerToken');
            $http.defaults.headers.common['Authorization'] = `Bearer ${localStorageService.get('bearerToken')}`;
        }
    });
});