'use strict';

app.factory('customerFactory', function ($http, $q, $location, config, usSpinnerService, localStorageService) {

    var service = {};
    var url = config.urlEbppApi;

    var _customerId = '';
    var _customerGuid = '';

    //GET SET

    service.setCustomerId = function (customerId) {
        _customerId = customerId;
    }

    service.setCustomerGuid = function (customerGuid) {
        _customerGuid = customerGuid;
    }

    service.getCustomerId = function () {
        return _customerId;
    }

    service.getCustomerGuid = function () {
        return _customerGuid;
    }

    //REST CALLS

    service.getCustomerByGuid = function (guid) {
        var deferred = $q.defer();
        var ebppCustomerGetUrl = url + '/Customer/Guid/' + guid;

        usSpinnerService.spin('spinner-1');

        $http.get(ebppCustomerGetUrl).then(
            function (getCustomerByGuidResponse) {
                usSpinnerService.stop('spinner-1');
                deferred.resolve(getCustomerByGuidResponse.data);
            }, function (getCustomerByGuidResponse) {
                usSpinnerService.stop('spinner-1');
                deferred.reject(getCustomerByGuidResponse);
            });

        return deferred.promise;

    }


    service.getCustomer = function (customerId) {
        var ebppCustomerGetUrl = url + '/Customer/Id/' + customerId;
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(ebppCustomerGetUrl).then(
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
    }

    service.getCustomerByUserInformationId = function (userId) {
        var ebppCustomerGetUrl = url + '/Customer/Id/' + userId;
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.get(ebppCustomerGetUrl).then(
            function (getCustomerByUserInformationIdResponse) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(getCustomerByUserInformationIdResponse);
            },
            function (getCustomerByUserIdResponse) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(getCustomerByUserInformationIdResponse);
            });

        return deferred.promise;
    }


    service.getCustomerByAlias = function (alias) {
        var ebppCustomerGetUrl = url + '/Customer/Alias/' + alias;
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

    //    $http.get(ebppCustomerGetUrl).then(
    //        function (getCustomerByAliasResponse) {
    //            success
    //            usSpinnerService.stop('spinner-1');
    //            deferred.resolve(getCustomerByAliasResponse);
    //        },
    //        function (getCustomerByAliasResponse) {
    //            failure
    //            usSpinnerService.stop('spinner-1');
    //            deferred.reject(getCustomerByAliasResponse);
    //        });

     return deferred.promise;
    }


    service.setLocalStorageCustomer = function (customer) {
        localStorageService.set('customerId', customer.CustomerId);
        localStorageService.set('firstName', customer.FirstName);
        localStorageService.set('lastName', customer.LastName);
        localStorageService.set('phoneNumber', customer.PhoneNumber);
        localStorageService.set('emailAddress', customer.EmailAddress);
        localStorageService.set('sendEmailReceipts', customer.SendEmailReceipts);
        localStorageService.set('notes', customer.Notes);
        localStorageService.set('addressLine1', customer.AddressLine1);
        localStorageService.set('addressCity', customer.AddressCity);
        localStorageService.set('addressState', customer.AddressState);
        localStorageService.set('addressZip', customer.AddressZip);
        localStorageService.set('company', customer.Company);
        localStorageService.set('secureNetCustomerId', customer.SecureNetCustomerId);

        return;
    }



    service.getLocalStorageCustomer = function () {

        var customer = {
            customerId: localStorageService.get('customerId'),
            customerGuid: localStorageService.get('customerGuid'),
            firstName: localStorageService.get('firstName'),
            lastName: localStorageService.get('lastName'),
            phoneNumber: localStorageService.get('phoneNumber'),
            emailAddress: localStorageService.get('emailAddress'),
            sendEmailReceipts: localStorageService.get('sendEmailReceipts'),
            notes: localStorageService.get('notes'),
            addressLine1: localStorageService.get('addressLine1'),
            addressCity: localStorageService.get('addressCity'),
            addressState: localStorageService.get('addressState'),
            addressZip: localStorageService.get('addressZip'),
            company: localStorageService.get('company'),
            secureNetCustomerId: localStorageService.get('secureNetCustomerId')
        };

        return $q.when(customer);
    }


    service.createCustomer = function (customer) {
        var ebppCustomerPostUrl = url + '/Customer/Create/{customer}';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.post(ebppCustomerPostUrl, customer).then(
            function (id) {
                //success
                usSpinnerService.stop('spinner-1');
                _customerId = id;
                $location.path('/login/' + id);
                deferred.resolve(id);
            }, function (data) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(data);
            });


        return deferred.promise;
    }

    service.updateCustomer = function (customer) {
        var ebppCustomerPutUrl = url + '/Customer/Update/{customer}';
        var deferred = $q.defer();
        usSpinnerService.spin('spinner-1');

        $http.put(ebppCustomerPutUrl, customer).then(
            function (data) {
                //success
                usSpinnerService.stop('spinner-1');
                deferred.resolve(data);
            },
            function (data) {
                //failure
                usSpinnerService.stop('spinner-1');
                deferred.reject(data);
            });

        return deferred.promise;
    }

    return service;

});