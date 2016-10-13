'use strict';

app.factory('$exceptionHander', function ($injector) {
    return function (exception, cause) {
        var $rootScope = $injector.get('$rootScope');
        $rootScope.errors = $rootScope.errors || [];
        $rootScope.errors.push(exception.message);
        console.log($rootScope.errors);
    }
});