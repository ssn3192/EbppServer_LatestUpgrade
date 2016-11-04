'use strict';

app.factory('loginFactory', function ($http, $q, $location, config, usSpinnerService, localStorageService) {
    var service = {};
    var url = config.urlEbppApi;

    service.login = function (cred) {
        var deferred = $q.defer();
        var urlPost = url + '/Customer/';

        usSpinnerService.spin('spinner-1');

        $http.post(urlPost, cred).then(
            function (loginResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(loginResponse);
            },
            function (loginResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(loginResponse);
            });

        return deferred.promise;
    };

    service.logout = function () {


        var localStorageKeys = localStorageService.keys();

        angular.forEach(localStorageKeys, function (key, value) {
            localStorageService.remove(key);
        });

    };


    return service;
});