
'use strict';

app.controller('transactionHistoryController', function transactionHistoryController($routeParams, customerFactory, transactionHistoryFactory, config) {

    var vm = this;

    vm.merchantGuid = $routeParams.merchantGuid;
    vm.customerGuid = $routeParams.customerGuid;

    customerFactory.setCustomerGuid(vm.customerGuid);
    customerFactory.getCustomerByGuid(vm.customerGuid)
        .then(
            function (getCustomerByGuidResponse) {

                vm.customerId = getCustomerByGuidResponse.data.CustomerId;

                transactionHistoryFactory.getTransactionHistoryByCustomerId(vm.customerId).then(
                    function (getTransactionHistoryByCustomerIdResponse) {
                        //success
                        var data = getTransactionHistoryByCustomerIdResponse.data;
                        const arr = [];
                        for (var x in data) {
                            if (data.hasOwnProperty(x)) {
                                arr.push(data[x]);
                            }
                        }

                        vm.model = {
                            list: arr
                        };
                    },
                    function (getTransactionHistoryByCustomerId) {
                        //failure
                    });


            },
            function (getCustomerByGuidResponse) {
                var failure = getCustomerByGuidResponse;
            });

    //load transactionHistories
    var columnDefs = [
        {
            name: 'Order',
            field: 'OrderId'
        }, {
            name: 'Auth Code',
            field: 'AuthorizationCode'
        }, {
            name: 'Date',
            field: 'TransactionDate'
        }, {
            name: 'Amount',
            field: 'TransactionAmount'
        }
    ];

    vm.fields = [
      {
          key: 'list',
          type: 'ui-grid',
          templateOptions: {
              label: 'Simple UI Grid',
              columnDefs: columnDefs
          }
      }
    ];
});