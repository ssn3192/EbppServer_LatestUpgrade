'use strict';

app.controller('customerPaymentController', function (
    $location,
    paymentFactory,
    localStorageService,
    toaster
) {

    var vm = this;
    var customer = localStorageService.get('customer');
    vm.customerId = customer.customerId;
    vm.options = {};

    vm.model = {};

    var data;
    const gridArray = [];

    var customerPaymentGrid = localStorageService.get('customerPaymentGrid') || [];

    if (customerPaymentGrid.length > 0) {
        data = localStorageService.get('customerPaymentGrid');
        //populate gridArray
        dataPush(data);
    } else {
        paymentFactory.getPaymentsByCustomerId(vm.customerId).then(
            function (getPaymentsByCustomerIdResponse) {
                //success
                var data = getPaymentsByCustomerIdResponse.data;
                localStorageService.set('customerPaymentGrid', data);
                //populate gridArray
                dataPush(data);
            },
            function (getPaymentsByCustomerIdResponse) {
                //failure
                toaster.pop({
                    type: 'error',
                    title: 'getPaymentsByCustomerId',
                    body: getPaymentsByCustomerIdResponse,
                    showCloseButton: true
                });
            }
        );
    }

    vm.model = {
        list: gridArray
    };


    var paymentColumnDefs = [
        {
            name: 'Name',
            field: 'name'
        }, {
            name: 'Transaction Id',
            field: 'transactionId',
            cellTemplate: '<div><a href="#customerPaymentDetail/{{row.entity.TransactionId}}">{{row.entity.TransactionId}}</a></div>'
        }, {
            name: 'Type',
            field: 'paymentType'
        }, {
            name: 'Payment Date',
            field: 'paymentDate'
        }, {
            name: 'Settlement Date',
            field: 'settlementDate'
        }, {
            name: 'Status',
            field: 'status'
        }, {
            name: 'Amount',
            field: 'amount'
        }
    ];

    vm.options = {
        formState: {
            uiGridCtrl: function ($scope) {
                $scope.to.onRegisterApi = function (gridApi) {
                    vm.gridApi = gridApi;

                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        localStorageService.set('selectedPaymentRow', row.entity);
                        //$location.path('paymentDetail');
                    });
                };
            }
        }
    };

    vm.fields = [
        {
            key: 'list',
            type: 'ui-grid-group',
            templateOptions: {
                label: 'Payments',
                columnDefs: paymentColumnDefs,
                onRegisterApi: ''
            },
            controller: 'formState.uiGridCtrl'
        }
    ];

    //FUNCTIONS

    function dataPush(data) {

        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                gridArray.push(data[prop]);
            }
        }
    }

});

