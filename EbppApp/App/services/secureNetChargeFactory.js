'use strict';

app.factory('secureNetChargeFactory', function ($http, $q, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;


    //REST CALLS

    service.createCharge = function (chargeRequest) {
        var postUrl = url + '/SecureNetCharge/Create/{chargeRequest}';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');
        $http.post(postUrl, chargeRequest).then(
            function (createChargeResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(createChargeResponse);
            },
            function (createChargeResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(createChargeResponse);
            });

        return deferred.promise;
    }

    return service;
})