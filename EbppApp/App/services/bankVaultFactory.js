'use strict';

app.factory('bankFactory', function ($http, $q, $location, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;


    var _bankId = '';

    service.setBankId = function (bankId) {
        _bankId = bankId;
    };

    service.getBankId = function () {
        return _bankId;
    };

    service.getBank = function (bankId) {
        var getBankUrl = url + '/Bank/Id/' + bankId + '/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(getBankUrl).then(
            function (getBankResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(getBankResponse);
            },
            function (getBankResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(getBankResponse);
            });

        return deferred.promise;
    }


    service.insertBank = function (bank) {
        var ebppInsertBankPostUrl = url + '/Bank/Create/{bank}/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(ebppInsertBankPostUrl, bank).then(
            function (insertBankResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                _bankId = insertBankResponse;
                deferred.resolve(insertBankResponse);
            }, function (insertBankResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(insertBankResponse);
            });

        return deferred.promise;
    };


    service.bankCount = function (customerId) {
        var ebppBankCountGetUrl = url + '/Bank/Count/' + customerId + '/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(ebppBankCountGetUrl).then(
            function (bankCountResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(bankCountResponse);
            }, function (bankCountResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(bankCountResponse);
            });

        return deferred.promise;
    };

    return service;

});