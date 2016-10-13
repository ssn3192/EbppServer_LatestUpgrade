'use strict';

app.controller('registerController', function (
    $rootScope,
    $location,
    $window,
    $scope,
    registerFactory,
    customerFactory,
    common,
    toaster,
    usSpinnerService,
    localStorageService,
    config) {

    var vm = this;

    var controllerId = 'register';
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    var successLogger = getLogFn(controllerId, 'success');
    var errorLogger = getLogFn(controllerId, 'error');
    var passwordErrorMessageSuffix = "must contain a digit, an upper-case letter, and be at least 6 characters long"


    vm.register = register;

    var customerFromMerchant = localStorageService.get('customerFromMerchant').data;

    vm.model = {
        accountNumber: customerFromMerchant.accountNumber,
        firstName: customerFromMerchant.firstName,
        lastName: customerFromMerchant.lastName,
        sendEmailReceipts: false
    };



    //FUNCTIONS--
    function register() {
        var model = vm.model;
        usSpinnerService.spin('spinner-1');

        if (model.password !== model.confirmPassword) {
            toaster.pop({
                type: 'error',
                title: 'Register',
                body: 'Passwords do not match',
                showCloseButton: true,
                onHideCallback: function () {
                    usSpinnerService.stop('spinner-1');
                }
            });

            model.password = '';
            model.confirmPassword = '';
            return;
        }

        var addUserRequest = {
            pwd: vm.model.password,
            cpwd: vm.model.confirmPassword,
            alias: vm.model.username,
            firstName: vm.model.firstName,
            lastName: vm.model.lastName,
            email: vm.model.email,
            phone: vm.model.phoneNumber
        }

        registerFactory.registerNewUser(addUserRequest).then(
            function (registerNewUserResponse) {
                //success
                var data = registerNewUserResponse.data;
                vm.userId = data;

                var customerModel = {
                    FirstName: vm.model.firstName,
                    LastName: vm.model.lastName,
                    PhoneNumber: vm.model.phoneNumber,
                    UserId: vm.userId,
                    EmailAddress: vm.model.email,
                    CustomerDuplicateCheckIndicator: 0,
                    SendEmailReceipts: model.sendEmailReceipts
                }

                customerFactory.createCustomer(customerModel).then(
                    function (createCustomerResponse) {
                        //success
                        vm.customerId = createCustomerResponse.data;
                        customerFromMerchant.customerId = vm.customerId;

                        var merchantCustomerModel = {
                            merchantId: vm.merchantId,
                            customerId: createCustomerResponse.data.customerId,
                            accountNumber: vm.model.accountNumber
                        }

                        registerFactory.createMerchantCustomerXref(merchantCustomerModel).then(
                           function (createMerchantCustomerXrefResponse) {
                               //success

                               registerFactory.updateCustomerFromMerchant(customerFromMerchant).then(
                                        function (updateCustomerFromMerchantResponse) {
                                            //success
                                            $location.path('login');
                                        },
                                   function (updateCustomerFromMerchantResponse) {
                                       //failure
                                       toaster.pop({
                                           type: 'error',
                                           title: 'updateCustomerFromMerchant',
                                           body: updateCustomerFromMerchantResponse.data,
                                           showCloseButton: true
                                       });
                                   });
                           },
                                function (createMerchantCustomerXrefResponse) {
                                    //failure
                                    toaster.pop({
                                        type: 'error',
                                        title: 'createMerchantCustomerXref',
                                        body: createMerchantCustomerXrefResponse.data,
                                        showCloseButton: true
                                    });
                                });
                    },
                        function (createCustomerResponse) {
                            //failure
                            toaster.pop({
                                type: 'error',
                                title: 'createCustomer',
                                body: createCustomerResponse.data,
                                showCloseButton: true
                            });
                        });
            },
            function (registerNewUserResponse) {
                //failure
                toaster.pop({
                    type: 'error',
                    title: 'registerNewUser',
                    body: registerNewUserResponse.data,
                    showCloseButton: true
                });
            });
    };
});