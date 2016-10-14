'use strict';

app.factory('registerFactory', function (config, $http, $q, usSpinnerService, common, toaster) {
    var service = {};
    var url = config.urlEbppApi;


    var _merchantCustomerXferId = '';

    service.setMerchantCustomerXferId = function (merchantCustomerXferId) {
        _merchantCustomerXferId = merchantCustomerXferId;
    };

    service.getMerchantCustomerXferId = function () {
        return _merchantCustomerXferId;
    };

    service.getMerchantCustomerXfer = function () {
        var ebppMerchantCustomerXferGetUrl = url + '/MerchantCustomerXref/Id' + _merchantCustomerXferId + '/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(ebppMerchantCustomerXferGetUrl).then(function (response) {
            //success
            usSpinnerService.stop('spinner-1');
            deferred.resolve(response);
        }, function (response) {
            //failure
            usSpinnerService.stop('spinner-1');
            deferred.reject(response);
        });

        return deferred.promise;
    };

    service.createMerchantCustomerXref = function (merchantCustomerXref) {
        var ebppMerchantCustomerXferPostUrl = url + '/MerchantCustomerXref/Create/{merchantCustomerXref}/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(ebppMerchantCustomerXferPostUrl, merchantCustomerXref).then(function (response) {
            //success
            usSpinnerService.stop('spinner-1');
            deferred.resolve(response);
        }, function (response) {
            //failure
            usSpinnerService.stop('spinner-1');
            deferred.reject(response);
        });

        return deferred.promise;
    };

    service.updateCustomerFromMerchant = function (customerFromMerchant) {
        var urlPut = url + '/CustomerFromMerchant/Update/{customerFromMerchant}';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.put(urlPut, customerFromMerchant).then(
            function (updateCustomerFromMerchantResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(updateCustomerFromMerchantResponse);
            },
            function (updateCustomerFromMerchantResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(updateCustomerFromMerchantResponse);
            });
        return deferred.promise;
    };

    service.registerNewUser = function (addUserRequest) {
        var urlPost = url + '/User/Create/{addUserRequest}/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');
        $http.post(urlPost, addUserRequest).then(
            function (registerNewUserReponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(registerNewUserReponse);
            },
            function (registerNewUserReponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(registerNewUserReponse);
            });

        return deferred.promise;
    }



    // VALIDATION:
    service.validation = {};

    service.validation.registrationFieldErrors = function (model) {
        var registrationFieldErrors = [];
        var error;

        if (error = phoneNumberError()) {
            registrationFieldErrors.push(error);
            error = null;
        }
        if (error = usernameError()) {
            registrationFieldErrors.push(error);
            error = null;
        }
        if (error = passwordValidationError()) {
            registrationFieldErrors.push(error);
            //error = null; not resetting error, so that passwords match validation, only occurs when password is valid
        }
        if (!error && (error = passwordsMatchValidationError())) {
            registrationFieldErrors.push(error);
            error = null;
        }
        if (error = emailValidationError()) {
            registrationFieldErrors.push(error);
            error = null;
        }

        return registrationFieldErrors.length ? registrationFieldErrors : false;

        function phoneNumberError() {
            if (model.phoneNumber && !common.isPhoneNumber(model.phoneNumber)) {
                return {
                    message: 'Phone number is invalid',
                    fieldsToReset: ['phoneNumber']
                }
            }
        }

        function usernameError() {
            /* Need a service to determine if a username is taken
            return {
                message: 'That user name is taken, please try another',
                fieldsToReset: ['username']
            }
            */
        }

        function passwordValidationError() {
            var pwd = model.password;

            var pwdLength = pwd.length;
            var pwdNumber = pwd.search(/\d/);
            var pwdUpperLetter = pwd.search(/[A-Z]/);

            if (!pwdNumber || pwdUpperLetter < 0 || !pwdLength >= 6) {
                return {
                    message: 'Password must be at least 6 characters, contain one upper case letter, and contain one number',
                    fieldsToReset: ['password', 'confirmPassword']
                }
            }
        }

        function passwordsMatchValidationError() {
            if (model.password !== model.confirmPassword) {
                return {
                    message: 'Passwords must match',
                    fieldsToReset: ['password', 'confirmPassword']
                }
            }
        }

        function emailValidationError() {
            if (!common.EMAIL_REGEXP.test(model.email)) {
                return {
                    message: 'Email is invalid',
                    fieldsToReset: ['email']
                }
            }
        }

    };

    return service;
});