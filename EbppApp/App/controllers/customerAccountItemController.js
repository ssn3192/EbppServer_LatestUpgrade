'use strict';

app.controller('customeraccountitemController', function (
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

    vm.model = {
       
        itemNumber: '9923247',
        itemDescription: "grocery",
        itemAmount: 122
    }

    function save() {

        var items = {
            itemNumber: vm.model.itemNumber,
            itemDescription: vm.model.itemDescription,
            itemAmount:vm.model.itemAmount
        }


        customeraccountitemFactory.insertCustomerAccountItem(item).then(
            function (insertCustomerAccountItemResponse) {
                //success
                var history = localStorageService.get('customeraccountitem') === null ? [] : localStorageService.get('customeraccountitem');
                var previousPage = history.slice(-1)[0];
                $location.path(previousPage);
            },
            function (insertCustomerAccountItemResponse) {
                //failure
                toaster.pop({
                    type: 'error',
                    title: 'Bank',
                    body: insertCustomerAccountItemResponse,
                    showCloseButton: true
                });
            });
    }
});

