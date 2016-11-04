'use strict';
app.factory('customeraccountitemFactory', function ($http, $q, $location, config, usSpinnerService) {

    var service = {};
    var url = config.urlEbppApi;

    var _itemId = '';
    service.setItemId = function (itemId) {
        _itemId = itemId;
    };

    service.getItemId = function () {
        return _itemId;
    };

    service.getcustomerAccountItem = function (itemId) {
        var getcustomerAccountItemUrl = url + '/CustomerAccountItem/CustomerAccountId/' + itemId + '/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(getcustomerAccountItemUrl).then(
           function (getcustomerAccountItemResponse) {
               //success
               usSpinnerService.stop('spinner-1');
               deferred.resolve(getcustomerAccountItemResponse);
           },
           function (getcustomerAccountItemResponse) {
               //failure
               usSpinnerService.stop('spinner-1');
               deferred.reject(getcustomerAccountItemResponse);
           });

        return deferred.promise;
    }

    service.insertcustomerAccountItem = function (item) {
        var ebppInsertcustomerAccountItemPostUrl = url + '/CustomerAccountItem/Create/{customeraccountitem}/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(ebppInsertcustomerAccountItemPostUrl, item).then(
            function (insertcustomerAccountItemResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                _itemId = insertcustomerAccountItemResponse;
                deferred.resolve(insertcustomerAccountItemResponse);
            }, function (insertcustomerAccountItemResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(insertcustomerAccountItemResponse);
            });

        return deferred.promise;
    };

});