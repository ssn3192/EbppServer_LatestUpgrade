'use strict';

app.factory('bankOnFileFactory', function ($http, $q, $location, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;

    var _bankId = '';

    service.setBankId = function (bankId) {
        _bankId = bankId;
    }

    service.getBankId = function () {
        return _bankId;
    }

    service.getPrimaryBank = function (customerGuid) {
        var deferred = $q.defer();
        var ebppBankGetUrl = url + '/Bank/Primal/' + customerGuid;

        usSpinnerService.spin('spinner-1');

        $http.get(ebppBankGetUrl).then(
            function (response) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(response);
            }, function (response) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(response);
            });

        return deferred.promise;

    }

    service.getCustomerBanks = function (customerId) {
        var deferred = $q.defer();
        var urlGet = url + '/Bank/CustomerId/' + customerId + '/';

        $http.get(urlGet).then(
            function (getCustomerBanksResponse) {
                //success
                return deferred.resolve(getCustomerBanksResponse);
            },
            function (getCustomerBanksResponse) {
                //failure
                return deferred.reject(getCustomerBanksResponse);
            });
        return deferred.promise;
    }

    service.updateBank = function (bank) {
        var deferred = $q.defer();
        var ebppInsertBankPutUrl = url + '/Bank/Update/{bank}';

        usSpinnerService.spin('spinner-1');

        $http.post(ebppInsertBankPutUrl, bank).then(
            function (response) {
                //success
                usSpinnerService.stop('spinner-1');
                _bankId = response;
                deferred.resolve(response);
            }, function (response) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(response);
            });

        return deferred.promise;
    }

    return service;

});