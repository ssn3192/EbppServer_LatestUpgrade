'use strict';

app.factory('invoiceFactory', function (usSpinnerService, config, localStorageService, $q, $http) {
    var service = {};
    var url = config.urlEbppApi;

    service.getInvoice = function (merchantId, customerId) {
        usSpinnerService.spin('spinner-1');
        var deferred = $q.defer();
        var urlGet = url + '/CustomerFromMerchant/MerchantId/' + merchantId + '/CustomerId/' + customerId + '/';

        $http.get(urlGet).then(
            function (getInvoiceResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                return deferred.resolve(getInvoiceResponse);

            },
            function (getInvoiceResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                return deferred.reject(getInvoiceResponse);
            }
        );

        return deferred.promise;

    }

    service.getLocalStorageInvoice = function () {
        var invoice = localStorageService.get('invoice');

        return $q.when(invoice);
    }

    service.setLocalStorageInvoice = function (invoice) {

        var dueDateUtc = new Date(invoice.dueDateUtc);

        invoice.dueDateUtc = moment.utc(dueDateUtc).local().format('l');

        localStorageService.set('invoice', invoice);

        return $q.when(invoice);
    }

    return service;

})