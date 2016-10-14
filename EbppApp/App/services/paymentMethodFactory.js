'use strict';

app.factory('paymentMethodFactory', function (
    $http,
    $q,
    config,
    localStorageService,
    usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;

    var customer = localStorageService.get('customer');
    var customerId = customer.customerId;

    service.getPaymentMethodCard = function () {
        var deferred = $q.defer();
        var urlGet = url + '/Card/Drop/' + customerId + '/';

        $http.get(urlGet).then(
            function (getPaymentMethodCardResponse) {
                //success
                deferred.resolve(getPaymentMethodCardResponse);
            },
            function (getPaymentMethodCardResponse) {
                //failure
                deferred.reject(getPaymentMethodCardResponse);
            });
        return deferred.promise;
    }

    service.getPaymentMethodBank = function () {
        var deferred = $q.defer();
        var urlGet = url + '/Bank/Drop/' + customerId + '/';

        $http.get(urlGet).then(
            function (getPaymentMethodBankResponse) {
                //success
                deferred.resolve(getPaymentMethodBankResponse);
            },
            function (getPaymentMethodBankResponse) {
                //failure
                deferred.reject(getPaymentMethodBankResponse);
            });
        return deferred.promise;
    }

    return service;

})