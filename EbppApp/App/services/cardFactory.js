'use strict';

app.factory('cardFactory', function ($http, $q, $location, config, usSpinnerService) {
    var service = {};
    var url = config.urlEbppApi;


    var _cardId = '';

    service.setCardId = function (cardId) {
        _cardId = cardId;
    };

    service.getCardId = function () {
        return _cardId;
    };

    service.getCard = function (cardId) {
        var getCardUrl = url + 'Card/cardId';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(getCardUrl).then(
            function (getCardResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(response);
            },
            function (getCardResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(response);
            });

        return deferred.promise;
    }


    service.insertCard = function (card) {
        var ebppInsertCardPostUrl = url + '/Card/Create/{card}';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(ebppInsertCardPostUrl, card).then(
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
    };


    service.cardCount = function (customerId) {
        var ebppCardCountGetUrl = url + '/Card/Count/' + customerId;
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(ebppCardCountGetUrl).then(
            function (response) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(response);
            },
            function (response) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(response);
            });

        return deferred.promise;
    };


    service.getStates = function () {
        return [
            {
                "name": "Alabama",
                "abbr": "AL"
            },
            {
                "name": "Alaska",
                "abbr": "AK"
            },
            {
                "name": "American Samoa",
                "abbr": "AS"
            },
            {
                "name": "Arizona",
                "abbr": "AZ"
            },
            {
                "name": "Arkansas",
                "abbr": "AR"
            },
            {
                "name": "California",
                "abbr": "CA"
            },
            {
                "name": "Colorado",
                "abbr": "CO"
            },
            {
                "name": "Connecticut",
                "abbr": "CT"
            }
        ];
    }

    service.expiryYearOptions = function (argsObj) {
        argsObj = argsObj || {};
        var futureYearsExtent = argsObj.futureYearsExtent || 11;

        var fullYear = new Date().getFullYear();
        var fullYearAsString = fullYear.toString();
        var expiryYearOptions = [{ name: fullYearAsString, value: fullYearAsString }];

        for (var i = 1, n = futureYearsExtent; i <= n; i++) {
            fullYearAsString = (fullYear + i).toString();
            expiryYearOptions.push({
                name: fullYearAsString,
                value: fullYearAsString
            });
        }

        return expiryYearOptions;
    }

    service.expiryMonthOptions = function () {
        return [
            { name: 'January', value: '01' },
            { name: 'February', value: '02' },
            { name: 'March', value: '03' },
            { name: 'April', value: '04' },
            { name: 'May', value: '05' },
            { name: 'June', value: '06' },
            { name: 'July', value: '07' },
            { name: 'August', value: '08' },
            { name: 'September', value: '09' },
            { name: 'October', value: '10' },
            { name: 'November', value: '11' },
            { name: 'December', value: '12' }
        ];
    }

    return service;

});