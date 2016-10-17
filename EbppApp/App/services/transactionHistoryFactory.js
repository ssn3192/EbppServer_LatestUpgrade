'use strict';

app.factory('transactionHistoryFactory', function ($http, $q, config) {
    var service = {};
    var url = config.urlEbppApi;
    var deferred = $q.defer();

    var _guestId = '';
    var _customerId = '';

    service.setGuestId = function (guestId) {
        _guestId = guestId;
    }

    service.getGuestId = function () {
        return _guestId;
    }

    service.setCustomerId = function (customerId) {
        _customerId = customerId;
    }

    service.getCustomerId = function () {
        return _customerId;
    }

    service.getTransactionHistoryByCustomerId = function (id) {
        var ebppTransactionHistoryGetUrl = url + '/TransactionHistory/CustomerId/' + id;

        $http.get(ebppTransactionHistoryGetUrl).then(
            function (getTransactionHistoryByCustomerResponse) {
                //success
                deferred.resolve(getTransactionHistoryByCustomerResponse);

            },
            function (getTransactionHistoryByCustomerResponse) {
                //failure

                deferred.reject(getTransactionHistoryByCustomerResponse);
            }
        );
        return deferred.promise;
    };


    service.writeEbppTransactionHistory = function (transaction) {
        var ebppChargePostUrl = url + '/TransactionHistory/Create/{transactionHistory}';


        $http.post(ebppChargePostUrl, transaction).then(
            function (writeEbppTransactionHistoryResponse) {
                //success
                deferred.resolve(writeEbppTransactionHistoryResponse);
            },
            function (writeEbppTransactionHistoryResponse) {
                //failure
                deferred.reject(writeEbppTransactionHistoryResponse);
            }
        );
        return deferred.promise;
    };

    return service;

});