'use strict';

app.factory('registerFactory', function (config, $http, $q, usSpinnerService, common, toaster) {
    var service = {};
    var url = config.urlEbppApi;


    var _customermerchantXrefId = '';

    service.setCustomerMerchantXrefId = function (customermerchantXrefId) {
        _customermerchantXrefId = customermerchantXrefId;
    };

    service.getCustomerMerchantXrefId = function () {
        return _customermerchantXrefId;
    };

    service.getCustomerMerchantXrefId = function () {
        var ebppCustomerMerchantXrefGetUrl = url + '/CustomerMerchantXref/Id' + _customermerchantXrefId + '/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(ebppCustomerMerchantXrefGetUrl).then(function (response) {
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

    service.createCustomerMerchantXref = function (customerMerchantXref) {
        var ebppCustomerMerchantXrefPostUrl = url + '/CustomerMerchantXref/Create/{CustomerMerchantXref}/';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(ebppCustomerMerchantXrefPostUrl, customerMerchantXref).then(function (response) {
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

    service.updatecustomer = function (customer) {
        var urlPut = url + '/Customer/Update/{customer}';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.put(urlPut, customer).then(
            function (updatecustomerResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(updatecustomerResponse);
            },
            function (updatecustomerResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(updatecustomerResponse);
            });
        return deferred.promise;
    };

    service.registerNewUser = function (addUserRequest) {
        var urlPost = url + '/UserInformation/Create/{addUserRequest}/';
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