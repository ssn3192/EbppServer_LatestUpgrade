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

    //vm.fields = [
    //    {
    //        key: 'accountNumber',
    //        type: 'input',
    //        templateOptions: {
    //            label: 'Account Number *',
    //            placeholder: 'of the form xxx-xxxx-xxx',
    //            onBlur: common.coerceInitialValidation('accountNumber')
    //        },
    //        validators: {
    //            accountNumber: function () {
    //                return common.validate('requiredValue', arguments, vm, 'Account Number is required');
    //            }
    //        }
    //    },
    //    {
    //        key: 'lastAmountPaid',
    //        type: 'currency',
    //        templateOptions: {
    //            label: 'Last Amount Paid *',
    //            placeholder: 'Enter last amount paid from invoice',
    //            onBlur: common.coerceInitialValidation('lastAmountPaid')
    //        },
    //        validators: {
    //            lastAmountPaid: function () {
    //                return common.validate('requiredValue', arguments, vm, 'Last Amount Paid is required');
    //            }
    //        }
    //    }
    //];

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


    //function preRegister() {
    //    preRegisterFactory.getCustomerFromMerchant(vm.merchantId, vm.model.accountNumber, vm.model.lastAmountPaid, function(response) {
    //        var data = response;

    //        if (data.CustomerId > 0) {
    //            vm.model.accountNumber = '';
    //            vm.model.lastAmountPaid = '';

    //            toaster.pop({
    //                type: 'error',
    //                title: 'Register',
    //                body: 'Account has already been registered',
    //                showCloseButton: true
    //            });

    //            return;
    //        }

    //        localStorageService.set('customerFromMerchant', data);

    //        $location.path('register');
    //    });
    //}
});