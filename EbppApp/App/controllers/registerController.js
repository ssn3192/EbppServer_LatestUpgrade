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

    var customer = localStorageService.get('customerAccount');
    vm.customer = customer;

    vm.model = {
        accountNumber: customer.accountNumber,
      firstName: customer.FirstName,
        lastName: customer.LastName,
        sendEmailReceipts: false
    };

  //  var a = 0;

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

                var customer = {
                    FirstName: vm.model.firstName,
                    LastName: vm.model.lastName,
                    PhoneNumber: vm.model.phoneNumber,
                 //   alias: vm.alias,
                    EmailAddress: vm.model.email,
                    CustomerDuplicateCheckIndicator: 0,
                    SendEmailReceipts: model.sendEmailReceipts
                }

                customerFactory.createCustomer(customer).then(
                    function (createCustomerResponse) {
                        //success
                        vm.customerId = createCustomerResponse.data;
                        customerAccount.customerId = vm.customerId;

                        var accountModel= {
                            merchantId: vm.merchantId,
                            customerId: createCustomerResponse.data.customerId,
                            accountNumber: vm.model.accountNumber
                        }

                        registerFactory.createMerchantCustomerXref(accountModel).then(
                           function (createMerchantCustomerXrefResponse) {
                               //success

                               registerFactory.updatecustomerAccount(customerAccount).then(
                                        function (updatecustomerAccountResponse) {
                                            //success
                                            $location.path('login');
                                        },
                                   function (updatecustomerAccountResponse) {
                                       //failure
                                       toaster.pop({
                                           type: 'error',
                                           title: 'updatecustomerAccount',
                                           body: updatecustomerAccountResponse.data,
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