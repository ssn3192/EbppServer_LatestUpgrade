'use strict';

app.controller('bankOnFileController', function (
    $location,
    bankOnFileFactory,
    secureNetChargeFactory,
    customerFactory,
    achFactory,
    achHistoryFactory,
    localStorageService,
    toaster) {

    var vm = this;
    var customer = localStorageService.get('customer');
    vm.secureNetCustomerId = customer.secureNetCustomerId;
    vm.customerId = customer.customerId;
    vm.options = {};

    vm.model = {};


    bankOnFileFactory.getCustomerBanks(vm.customerId).then(
        function (getCustomerBanksResponse) {
            //success
            var data = getCustomerBanksResponse.data;
            const arr = [];
            for (let property in data) {
                if (data.hasOwnProperty(property)) {
                    arr.push(data[property]);
                }
            }

            vm.model = {
                list: arr
            }
        },
        function (getCustomerBanksResponse) {
            //failure
            toaster.pop({
                type: 'error',
                title: 'BankOnFile',
                body: getCustomerBanksResponse,
                showCloseButton: true
            });
        });

    var columnDefs = [
        {
            name: 'Nick Name',
            field: 'nickname'
        }, {
            name: 'Bank',
            field: 'bankAccountName'
        }, {
            name: 'Name on Account',
            field: 'nameOnAccount'
        }
    ];

    vm.fields = [
        {
            key: 'list',
            type: 'ui-grid-group',
            templateOptions: {
                label: 'Banks',
                columnDefs: columnDefs
            }
        }
    ];


});