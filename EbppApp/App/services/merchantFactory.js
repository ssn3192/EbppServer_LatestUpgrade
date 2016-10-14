'use strict';

app.factory('merchantFactory', function (config, $http, $q, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;


    var _merchant = '';
    var _merchantGuid = '';
    var _logoUrl = '';



    service.setMerchantGuid = function (merchantGuid) {
        _merchantGuid = merchantGuid;
    }

    service.getMerchantGuid = function () {
        return _merchantGuid;
    }

    service.getMerchant = function (merchantId) {
        var urlLogoGetUrl = url + '/Merchant/MerchantId/' + merchantId;
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(urlLogoGetUrl).then(
            function (urlLogoGetUrlResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                _merchant = urlLogoGetUrlResponse.data;
                deferred.resolve(urlLogoGetUrlResponse);
            },
            function (urlLogoGetUrlResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(urlLogoGetUrlResponse);
            });
        return deferred.promise;
    }

    return service;
});