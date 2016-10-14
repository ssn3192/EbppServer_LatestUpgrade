'use strict';

app.factory('guestFactory', function (config, $http, $q, usSpinnerService, common) {
    var service = {};
    var url = config.urlEbppApi;


    var _guestId = '';
    var _guest = '';
    var _chargeModel = '';
    var _secureNetChargeResponseModel = '';


    service.setSecureNetChargeResponseModel = function (response) {
        _secureNetChargeResponseModel = response;
    }

    service.getSecureNetChargeResponseModel = function () {
        return _secureNetChargeResponseModel;
    }

    service.setGuestId = function (guestId) {
        _guestId = guestId;
    }

    service.getGuestId = function () {
        return _guestId;
    }

    service.setGuest = function (guest) {
        _guest = guest;
    }

    service.setChargeModel = function (chargeModel) {
        _chargeModel = chargeModel;
    }

    service.getChargeModel = function () {
        return _chargeModel;
    }

    service.getGuest = function () {
        var ebppGuestGetUrl = url + '/Guest/Id/' + _guestId;

        var deferred = $q.defer();

        $http.get(ebppGuestGetUrl).then(
            function (getGuestResponse) {
                //success
                deferred.resolve(ebppGuestGetUrl);
            },
            function (getGuestResponse) {
                //failure
                deferred.reject(ebppGuestGetUrl);
            });
        return deferred.promise;
    }

    service.createGuest = function (guest) {
        var ebppGuestPostUrl = url + '/Guest/Create/{guest}';
        var deferred = $q.defer();
        $http.post(ebppGuestPostUrl, guest).then(
            function (createGuestResponse) {
                //success
                _guestId = createGuestResponse;
                deferred.resolve(createGuestResponse);
            },
            function (createGuestResponse) {
                //failure
                deferred.reject(createGuestResponse);
            });

        return deferred.promise;
    }

    service.guestCharge = function (charge) {

        //SecureNet
        var secureNetCustomerPostUrl = url + '/SecureNetCharge/Create/{chargeRequest}';
        var deferred = $q.defer();
        $http.post(secureNetCustomerPostUrl, charge).then(
            function (guestChargeResponse) {
                //success
                _secureNetChargeResponseModel = guestChargeResponse.data.transaction;

                deferred.resolve(guestChargeResponse.data.transaction);
            },
            function (guestChargeResponse) {
                //failure
                var oops = guestChargeResponse;
                deferred.reject(guestChargeResponse);
            });

        return deferred.promise;
    }

    service.writeEbppTransactionHistory = function (transactionHistoryData) {
        var ebppChargePostUrl = url + '/TransactionHistory/Create/{transactionHistory}';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(ebppChargePostUrl, transactionHistoryData).then(
            function (writeEbppTransactionHistoryResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(writeEbppTransactionHistoryResponse);
            },
            function (writeEbppTransactionHistoryResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(writeEbppTransactionHistoryResponse);
            }
        );
        return deferred.promise;
    };


    // VALIDATION
    service.validation = {};

    service.validation.commonFieldErrors = function (model) {
        var commonFieldErrors = [];
        var error;

        if (error = phoneNumberError()) {
            commonFieldErrors.push(error);
        }
        if (error = emailValidationError()) {
            commonFieldErrors.push(error);
        }

        return commonFieldErrors.length ? commonFieldErrors : false;

        function phoneNumberError() {
            if (model.phoneNumber && !common.isPhoneNumber(model.phoneNumber)) {
                return {
                    message: 'Phone number is invalid',
                    fieldsToReset: ['phoneNumber']
                }
            }
        }

        function emailValidationError() {
            if (!common.EMAIL_PATTERN.test(model.email)) {
                return {
                    message: 'Email is invalid',
                    fieldsToReset: ['email']
                }
            }
        }
    };

    service.validation.achFieldErrors = function (model) {
        var achFieldErrors = [];
        var error;

        if (error = routingNumberError()) {
            achFieldErrors.push(error);
        }
        if (error = accountNumberError()) {
            achFieldErrors.push(error);
        }

        return achFieldErrors;

        function routingNumberError() {
            var error = true;
            var routingNumber = model.routingNumber;
            var prefix = routingNumber.substring(0, 2);
            var n = 0;

            if (/^\d{9}$/.test(routingNumber)) {
                // see: http://answers.google.com/answers/threadview/id/43619.html
                if ((parseInt(prefix) >= 1 && parseInt(prefix) <= 12)
                    || (parseInt(prefix) >= 21 && parseInt(prefix) <= 32)) {

                    // see: http://www.brainjar.com/js/validation/
                    for (var i = 0; i < routingNumber.length; i += 3) {
                        n += parseInt(routingNumber.charAt(i), 10) * 3
                          + parseInt(routingNumber.charAt(i + 1), 10) * 7
                          + parseInt(routingNumber.charAt(i + 2), 10);

                        if (n && n % 10 === 0) {
                            error = false;
                        }
                    }
                }
            }

            if (error) {
                return {
                    message: 'Routing Number is invalid',
                    fieldsToReset: 'routingNumber'
                }
            }
        }

        function accountNumberError() {
            var accountNumber = model.dfiAccountNumber.replace(/\D/g, '');

            // see: http://stackoverflow.com/a/1540314
            if (!/\d{4,17}/.test(accountNumber)) {
                return {
                    message: 'Account Number is invalid',
                    fieldsToReset: ['dfiAccountNumber']
                }
            }
        }
    };

    service.validation.cardFieldErrors = function (model) {
        return [];
    };


    return service;
});