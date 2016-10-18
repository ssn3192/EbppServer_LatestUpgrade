'use strict';

app.controller('preRegisterController', function (
    $location,
    $scope,
    preRegisterFactory,
    loginFactory,
    localStorageService,
    toaster,
    config,
    common
) {
    var vm = this;

    loginFactory.logout();
    localStorageService.set('merchantId', 1);
    vm.merchantId = 1;

    vm.preRegister = preRegister;
    vm.options = {};
    vm.model = {};

    common.configErrorHandling($scope, vm);

    function preRegister() {
        //  alert("called");
        preRegisterFactory.getCustomeraccount(vm.merchantId, vm.model.accountNumber, vm.model.lastAmountPaid).then(
            function (getCustomerAccountResponse) {
                //success

                var data = getCustomerAccountResponse;


                if (data.CustomerId > 0) {
                    vm.model.accountNumber = '';
                    vm.model.lastAmountPaid = '';

                    toaster.pop({
                        type: 'error',
                        title: 'Register',
                        body: 'Account has already been registered',
                        showCloseButton: true
                    });

                    return;
                }

                localStorageService.set('customeraccount', data);
                //  alert("called");
                $location.path('register');

            },
            function (getCustomerAccountResponse) {
                //failure
                var f = getCustomerAccountResponse.data;
                //alert(getCustomerFromMerchantResponse.data);
            });
    }


   
});