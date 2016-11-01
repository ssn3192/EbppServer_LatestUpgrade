'use strict';

app.controller('loginController', function (
    $rootScope,
    $location,
    $window,
    $scope,
    common,
    localStorageService,
    jwtHelper,
    toaster,
    customerFactory,
    invoiceFactory,
    loginFactory,
    config) {
    var vm = this;



    loginFactory.logout();
    var controllerId = 'login';
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    var successLogger = getLogFn(controllerId, 'success');
    var errorLogger = getLogFn(controllerId, 'error');

    vm.achUser = 'wfs01';

    localStorageService.set('achUser', vm.achUser);

    localStorageService.set('merchantId', 1);
    vm.merchantId = localStorageService.get('merchantId');

    vm.achUser = 'wfs01';
    vm.login = login;

    vm.model = {
        //username: 'user00',
        //password: 'Pass_123'
    };

    common.configErrorHandling($scope, vm);


    //FUNCTIONS

    function login() {

        //loginFactory.logout();

        var credentials = {
            Username: vm.model.username,
            Pwd: vm.model.password
        };

        var credPrep = vm.model.username + ':' + vm.model.password;
        var cred = {
            E64: window.btoa(credPrep)
        };

        loginFactory.login(cred).then(
            function (loginResponse) {
                //success
                var data = loginResponse.data;
                var bearerToken = data.accessToken;
                localStorageService.set('bearerToken', bearerToken);
                var tokenPayload = jwtHelper.decodeToken(bearerToken);
                var alias = tokenPayload.sub;
                customerFactory.getCustomerByAlias(alias).then(
                    function (getCustomerResponse) {
                        //success
                        var customer = getCustomerResponse.data;
                        localStorageService.set('customer', customer);

                        invoiceFactory.getInvoice(vm.merchantId, customer.customerId).then(
                            function (getInvoiceResponse) {
                                //success
                                var invoice = getInvoiceResponse.data;
                                invoiceFactory.setLocalStorageInvoice(invoice).then(
                                    function (setLocalStorageInvoiceResponse) {
                                        //success
                                        $location.path('invoice');
                                    },
                                    function (setLocalStorageInvoiceResponse) {
                                        //failure
                                    });
                            },
                            function (getInvoiceResponse) {
                                //failure
                            });

                    },
                    function (getCustomerResponse) {
                        //failure
                    });
            },
            function (loginResponse) {
                //failure
            });
    };

});