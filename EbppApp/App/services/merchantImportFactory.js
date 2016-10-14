'use strict';

app.factory('merchantImportFactory', function (config, $http, $q, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;

    service.uploadFromStream = function (azureStorage) {
        var urlPost = url + '/AzureStorage/UploadFromStream/{azureStorage}';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(urlPost, azureStorage).then(
            function (uploadFromStreamResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(uploadFromStreamResponse);
            },
            function (uploadFromStreamResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(uploadFromStreamResponse);
            });
        return deferred.promise;
    };

    return service;
});