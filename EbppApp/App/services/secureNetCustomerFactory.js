'use strict';

app.factory('secureNetCustomerFactory', function ($http, $q, $location, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;


    var _customerId = '';

    //GET SET

    service.getCustomerId = function () {
        return _customerId;
    }

    service.setCustomerId = function (customerId) {
        _customerId = customerId;
    }

    //REST CALLS

    service.createCustomer = function (customer) {
        var secureNetCustomerPostUrl = url + '/SecureNetCustomer/Create/{createCustomerRequest}';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(secureNetCustomerPostUrl, customer).then(
            function (createCustomerResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(createCustomerResponse);
            },
            function (createCustomerResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(createCustomerResponse);
            });

        return deferred.promise;
    }

    return service;
})