'use strict';

app.controller('paymentController', function (
    $location,
    paymentFactory,
    localStorageService
) {

    var vm = this;
    var customer = localStorageService.get('customer');
    vm.customerId = customer.customerId;
    vm.options = {};

    vm.model = {};

    var data;
    const gridArray = [];

    if (localStorageService.get('merchantPaymentGrid') !== null) {
        data = localStorageService.get('merchantPaymentGrid');
        //populate gridArray
        dataPush(data);
    } else {
        paymentFactory.getPayments().then(
            function (getPaymentsResponse) {
                //success
                data = getPaymentsResponse.data;

                localStorageService.set('merchantPaymentGrid', data);

                //populate gridArray
                dataPush(data);

            },
            function (getPaymentsResponse) {
                //failure
            }
        );
    }

    vm.model = {
        list: gridArray
    };



    var paymentColumnDefs = [
        {
            name: 'Name',
            field: 'name',
            grouping: {
                groupPriority: 0,
                cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
            }
        }, {
            name: 'Transaction Id',
            field: 'transactionId',
            cellTemplate: '<div><a href="#paymentDetail/{{row.entity.TransactionId}}">{{row.entity.TransactionId}}</a></div>'
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

