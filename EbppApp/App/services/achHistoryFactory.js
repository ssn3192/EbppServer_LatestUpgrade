'use strict';

app.factory('achHistoryFactory', function ($http, $q, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;


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

    service.getAchHistoryByCustomerId = function (id) {
        var deferred = $q.defer();
        var achHistoryGetUrl = url + '/AchHistory/CustomerId/' + id;

        usSpinnerService.spin('spinner-1');

        $http.get(achHistoryGetUrl).then(
            function (getAchHistoryByCustomerIdResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(getAchHistoryByCustomerIdResponse);
            },
            function (getAchHistoryByCustomerIdResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(getAchHistoryByCustomerIdResponse);
            });
        return deferred.promise;
    }


    service.writeAchHistory = function (ach) {
        var deferred = $q.defer();
        var achPostUrl = url + '/AchHistory/Create/{achHistory}';

        usSpinnerService.spin('spinner-1');

        $http.post(achPostUrl, ach).then(
            function (writeAchHistoryResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(writeAchHistoryResponse);
            }, function (writeAchHistoryResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(writeAchHistoryResponse);
            });

        return deferred.promise;

    }

    return service;

});