'use strict';

app.factory('achFactory', function (config, $http, $q, usSpinnerService) {
    var service = {};


    service.processAch = function (achTransaction) {
        var url = config.urlEbppApi + '/AchTransaction/Create/{achTransaction}';
        var deferred = $q.defer();

        usSpinnerService.spin('spinner-1');

        $http.post(url, achTransaction).then(
            function (processAchResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(processAchResponse);
            },
            function (processAchResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(processAchResponse);
            });

        return deferred.promise;
    };

    return service;
});