'use strict';

app.factory('secureNetTokenFactory', function ($q, toaster) {
    var service = {};



    var _cardModel = '';

    var _token = '';

    service.setCardModel = function (cardModel) {
        _cardModel = cardModel;
    }

    service.getCardModel = function () {
        return _cardModel;
    }

    service.setTokenValue = function (token) {
        _token = token;
    }

    service.getTokenValue = function () {
        return _token;
    }

    service.createToken = function (card) {
        var deferred = $q.defer();
        window.tokenizeCard(card).then(
            function (getTokenResponse) {
                //success

                var responseCard = $.parseJSON(JSON.stringify(getTokenResponse));

                if (getTokenResponse.success) {
                    //alert(responseCard.token);
                    // do something with responseObj.token

                    _token = responseCard.token;

                    deferred.resolve(getTokenResponse);

                } else {

                    deferred.reject(getTokenResponse);
                    // do something with responseObj.message
                }
            },
            function (getTokenResponse) {
                //failure

                deferred.reject(getTokenResponse);
            });

        return deferred.promise;
    };


    return service;
});

