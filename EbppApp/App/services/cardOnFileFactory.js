'use strict';

app.factory('cardOnFileFactory', function ($http, $q, $location, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;


    var _cardId = '';

    service.setCardId = function (cardId) {
        _cardId = cardId;
    }

    service.getCardId = function () {
        return _cardId;
    }


    service.getPrimaryCard = function (customerGuid) {
        var ebppCardGetUrl = url + '/Card/Primal/' + customerGuid;
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(ebppCardGetUrl).then(
            function (response) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(response);
            }, function (response) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(response);
            });

        return deferred.promise;

    }

    service.getCustomerCards = function (customerId) {
        usSpinnerService.spin('spinner-1');
        var deferred = $q.defer();
        var urlGet = url + '/Card/CustomerId/' + customerId + '/';
        $http.get(urlGet).then(
            function (getCustomerCardsResponse) {
                usSpinnerService.stop('spinner-1');
                deferred.resolve(getCustomerCardsResponse);
            },
            function (getCustomerCardsResponse) {
                usSpinnerService.stop('spinner-1');
                deferred.reject(getCustomerCardsResponse);
            });

        return deferred.promise;
    }

    service.updateCard = function (card) {
        var ebppInsertCardPutUrl = url + '/Card/Update/{card}';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(ebppInsertCardPutUrl, card).then(
            function (response) {
                //success
                usSpinnerService.stop('spinner-1');
                _cardId = response;
                deferred.resolve(response);
            }, function (response) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(response);
            });

        return deferred.promise;
    }

    return service;

});