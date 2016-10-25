'use strict';

app.factory('preRegisterFactory', function ($http, $q, usSpinnerService, config) {
    var service = {};

    var url = config.urlEbppApi;

    service.getCustomerFromMerchant = function (merchantId, accountNumber, lastAmountPaid) {
        var urlGet = url + '/CustomerFromMerchant/MerchantId/' + merchantId + '/AccountNumber/' + accountNumber + '/LastAmountPaid/' + lastAmountPaid + '/';
        var deferred = $q.defer();
        $http.get(urlGet).then(
            function (getCustomerFromMerchantResponse) {
                //success
                return deferred.resolve(getCustomerFromMerchantResponse);
            },
            function (getCustomerFromMerchantResponse) {
                //failure
                return deferred.reject(getCustomerFromMerchantResponse);
            });
        return deferred.promise;
    }

    return service;
});
