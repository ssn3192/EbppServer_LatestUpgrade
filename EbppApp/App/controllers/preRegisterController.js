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
        preRegisterFactory.getCustomerFromMerchant(vm.merchantId, vm.model.accountNumber, vm.model.lastAmountPaid).then(
            function (getCustomerFromMerchantResponse) {
                //success

                var data = getCustomerFromMerchantResponse;


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

                localStorageService.set('customerFromMerchant', data);
                //  alert("called");
                $location.path('register');

            },
            function (getCustomerFromMerchantResponse) {
                //failure
                var f = getCustomerFromMerchantResponse.data;
                //alert(getCustomerFromMerchantResponse.data);
            });
    }


   
});