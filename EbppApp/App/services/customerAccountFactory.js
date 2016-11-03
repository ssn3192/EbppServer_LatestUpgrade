'use strict';

app.factory('customerAccountFactory', function ($http, $q, $location, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;

    var _Id = '';

    service.setId = function (Id) {
        _Id = Id;
    };

    service.getId = function () {
        return _Id;
    };

    service.getCustomerAccount = function (Id) {
        var getCustomerAccountUrl = url + '/CustomerAccount/Id/' + Id + '/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(getCustomerAccountUrl).then(
            function (getCustomerAccountResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(getCustomerAccountResponse);
            },
            function (getCustomerAccountResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(getCustomerAccountResponse);
            });

        return deferred.promise;
    }


    service.insertCustomerAccount = function (customeraccount) {
        var ebppInsertCustomerAccountPostUrl = url + '/CustomerAccount/Create/{customeraccount}/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(ebppInsertCustomerAccountPostUrl, customeraccount).then(
            function (insertCustomerAccountResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                _Id = insertCustomerAccountResponse;
                deferred.resolve(insertCustomerAccountResponse);
            }, function (insertCustomerAccountResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(insertCustomerAccountResponse);
            });

        return deferred.promise;
    };


    //service.bankCount = function (customerId) {
    //    var ebppBankCountGetUrl = url + '/Bank/Count/' + customerId + '/';
    //    var deferred = $q.defer();
    //    usSpinnerService.spin('spinner-1');

    //    $http.get(ebppBankCountGetUrl).then(
    //        function (bankCountResponse) {
    //            //success
    //            usSpinnerService.stop('spinner-1');
    //            deferred.resolve(bankCountResponse);
    //        }, function (bankCountResponse) {
    //            //failure
    //            usSpinnerService.stop('spinner-1');
    //            deferred.reject(bankCountResponse);
    //        });

    //    return deferred.promise;
    //};

    //return service;



});