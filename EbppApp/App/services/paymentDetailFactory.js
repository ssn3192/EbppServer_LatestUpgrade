'use strict';

app.factory('paymentDetailFactory', function ($http, $q, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;

    service.processRefund = function (refundRequest) {
        usSpinnerService.spin('spinner-1');
        var deferred = $q.defer();

        var urlPost = url + '/SecureNetRefund/Create/{refundRequest}';

        $http.post(urlPost, refundRequest).then(
            function (processRefundResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                return deferred.resolve(processRefundResponse);
            },
            function (processRefundResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                return deferred.reject(processRefundResponse);
            }
        );
        return deferred.promise;
    }
    return service;
})