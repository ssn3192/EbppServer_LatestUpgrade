'use strict';

app.factory('preRegisterFactory', function ($http, $q, usSpinnerService, config) {
    var service = {};

    var url = config.urlEbppApi;

    service.getCustomerAccount = function (merchantId, accountNumber, lastAmountPaid) {
        var urlGet = url + '/CustomerAccount/MerchantId/' + merchantId + '/AccountNumber/' + accountNumber + '/LastAmountPaid/' + lastAmountPaid + '/';
        var deferred = $q.defer();
        $http.get(urlGet).then(
            function (getCustomerAccountResponse) {
                //success
                return deferred.resolve(getCustomerAccountResponse);
            },
            function (getCustomerAccountResponse) {
                //failure
                return deferred.reject(getCustomerAccountResponse);
            });
        return deferred.promise;
    }

    return service;
});
