'use strict';

app.controller('bankController', function (
    $routeParams,
    $location,
    $scope,
    common,
    bankFactory,
    customerFactory,
    localStorageService,
    toaster) {

    var vm = this;
    vm.save = save;
    vm.options = {};
    var customer = localStorageService.get('customer');
    vm.customerId = customer.customerId;

    vm.model = {
        nickname: 'b',
        customerId: vm.customerId,
        bankAccountName: 'Banker Bob',
        nameOnAccount: 'Zebra Jones',
        routingNumber: '111901234',
        dfiAccountNumber: '9923247',
        transactionCode: 27,
        isPrimary: true
    }

    common.configErrorHandling($scope, vm, ['routingNumber', 'dfiAccountNumber']);


    //FUNCTIONS

    function save() {

        var bank = {
            customerId: vm.customerId,
            bankAccountName: vm.model.bankAccountName,
            dfiAccountNumber: vm.model.dfiAccountNumber,
            isPrimary: true,
            nameOnAccount: vm.model.nameOnAccount,
            routingNumber: vm.model.routingNumber,
            transactionCode: 27,
            nickname: vm.model.nickname
        }


        bankFactory.insertBank(bank).then(
            function (insertBankResponse) {
                //success
                var history = localStorageService.get('history') === null ? [] : localStorageService.get('history');
                var previousPage = history.slice(-1)[0];
                $location.path(previousPage);
            },
            function (insertBankResponse) {
                //failure
                toaster.pop({
                    type: 'error',
                    title: 'Bank',
                    body: insertBankResponse,
                    showCloseButton: true
                });
            });
    }
});