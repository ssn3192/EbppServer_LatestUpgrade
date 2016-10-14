'use strict';

app.factory('paymentFactory', function ($http, $q, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;

    //GET

    service.getPayments = function () {
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');
        var urlGet = url + '/Payment/Grid/';

        $http.get(urlGet).then(
            function (getPaymentsResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                return deferred.resolve(getPaymentsResponse);
            },
            function (getPaymentsResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                return deferred.reject(getPaymentsResponse);
            });

        return deferred.promise;
    }

    service.getPaymentsByCustomerId = function (id) {
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');
        var urlGet = url + '/Payment/CustomerId/' + id + '/';

        $http.get(urlGet).then(
            function (getPaymentsByCustomerIdResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                return deferred.resolve(getPaymentsByCustomerIdResponse);
            },
            function (getPaymentsByCustomerIdResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                return deferred.reject(getPaymentsByCustomerIdResponse);
            });

        return deferred.promise;
    }

    //POST

    service.postPayment = function (paymentRequest) {
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');
        var urlPost = url + '/Payment/Create/{payment}';

        $http.post(urlPost, paymentRequest).then(
            function (postPaymentResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                return deferred.resolve(postPaymentResponse);
            },
            function (postPaymentResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                return deferred.reject(postPaymentResponse);

            });
        return deferred.promise;
    }


    return service;
})