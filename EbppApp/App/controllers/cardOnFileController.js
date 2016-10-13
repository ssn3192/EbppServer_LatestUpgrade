'use strict';

app.controller('cardOnFileController', function (
    $location,
    cardOnFileFactory,
    secureNetChargeFactory,
    customerFactory,
    transactionHistoryFactory,
    localStorageService,
    toaster) {

    var vm = this;

    var customer = localStorageService.get('customer');
    vm.secureNetCustomerId = customer.secureNetCustomerId;
    vm.customerId = customer.customerId;
    vm.options = {};

    vm.model = {};

    //LOAD CARDONFILE

    vm.model = {};

    cardOnFileFactory.getCustomerCards(vm.customerId).then(
        function (getCustomerCardsResponse) {
            //success
            var data = getCustomerCardsResponse.data;
            const arr = [];
            for (var property in data) {
                if (data.hasOwnProperty(property)) {
                    arr.push(data[property]);
                }
            }

            vm.model = {
                list: arr
            };
        },
        function (getCustomerCardsResponse) {
            //failure
            toaster.pop({
                type: 'error',
                title: 'CardOnFile',
                body: getCustomerCardsResponse,
                showCloseButton: true
            });
        });


    var cardColumnDefs = [
    {
        name: 'Nick Name',
        field: 'nickname'
    }, {
        name: 'Card Number',
        field: 'lastFourDigits'
    }, {
        name: 'Expiration Date',
        field: 'expirationDate'
    }, {
        name: 'Primary',
        field: 'isPrimary'
    }
    ];

    vm.fields = [
        {
            key: 'list',
            type: 'ui-grid-group',
            templateOptions: {
                label: 'Cards',
                columnDefs: cardColumnDefs
            }
        }
    ];

});