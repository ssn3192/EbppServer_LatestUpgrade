'use strict';

app.factory('indexFactory', function ($http, $q, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;

    service.validateMerchant = function (merchantCredential) {
        var validateUrl = url + '/Merchant/Validate/{merchantCredential}/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(validateUrl, merchantCredential).then(
            function (validateMerchantResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(validateMerchantResponse);
            },
            function (validateMerchantResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                $location.path('insufficient');
                deferred.reject(validateMerchantResponse);
            });

        return deferred.promise;
    };

    return service;
})