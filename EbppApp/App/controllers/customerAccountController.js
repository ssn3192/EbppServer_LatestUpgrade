'use strict';

app.controller('customeraccountController', function (
    $routeParams,
    $location,
    $scope,
    common,
   // bankFactory,
   customerAccountFactory,
    customerFactory,
    localStorageService,
    toaster) {

    var vm = this;
    vm.save = save;
    vm.options = {};
    var customer = localStorageService.get('customer');
 // vm.customerId = customer.customerId;

    vm.model = {
        
        firstName: 'Banker Bob',
        lastName: 'Zebra Jones',
        phoneNumber: '111901234',
        accountNumber: '6',
        
    }


    function save() {

        var customeraccount = {
            customerId: vm.customerId,
            firstName: vm.model.firstName,
            lastName: vm.model.lastName,  
            phoneNumber: vm.model.phoneNumber,
            accountNumber: vm.model.accountNumber
            
        }


        customerAccountFactory.insertCustomerAccount(customeraccount).then(
            function (insertCustomerAccountResponse) {
                //success
                var history = localStorageService.get('history') === null ? [] : localStorageService.get('history');
                var previousPage = history.slice(-1)[0];
                $location.path(previousPage);
            },
            function (insertCustomerAccountResponse) {
                //failure
                toaster.pop({
                    type: 'error',
                    title: 'customeraccount',
                    body: insertCustomerAccountResponse,
                    showCloseButton: true
                });
            });
    }
});