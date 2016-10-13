'use strict';


app.controller('customerPaymentDetailController', function (
    $location,
    $routeParams,
    localStorageService,
    toaster,
    paymentDetailFactory,
    paymentDetailEntity
    ) {
    var vm = this;

    vm.transactionId = $routeParams.transactionId;

    if (angular.isDefined(paymentDetailEntity)) {
        vm.model = paymentDetailEntity;
    }

    vm.fields = [
        {
            className: 'row',
            fieldGroup: [
                {
                    className: 'col-md-3',
                    key: 'Name',
                    type: 'readonly',
                    templateOptions: {
                        label: 'Name'
                    }
                },
                {
                    className: 'col-md-2',
                    key: 'TransactionId',
                    type: 'readonly',
                    templateOptions: {
                        label: 'Transaction Id'
                    }
                },
                {
                    className: 'col-md-2',
                    key: 'Amount',
                    type: 'readonly',
                    templateOptions: {
                        label: 'Amount'
                    }
                },
                {
                    className: 'col-md-2',
                    key: 'Status',
                    type: 'readonly',
                    templateOptions: {
                        label: 'Status'
                    }
                }
            ]
        },
        {
            className: 'row',
            fieldGroup: [
                {
                    className: 'col-md-3',
                    key: 'PaymentType',
                    type: 'readonly',
                    templateOptions: {
                        label: 'Payment Type'
                    }
                }, {
                    className: 'col-md-3',
                    key: 'AccountNumber',
                    type: 'readonly',
                    templateOptions: {
                        label: 'Account Number'
                    }
                }, {
                    className: 'col-md-3',
                    key: 'RoutingNumber',
                    type: 'readonly',
                    templateOptions: {
                        label: 'Routing Number'
                    }
                }
            ]
        },
        {
            className: 'row',
            fieldGroup: [
                {
                    className: 'col-md-3',
                    key: 'PaymentDate',
                    type: 'readonly',
                    templateOptions: {
                        label: 'Payment Date'
                    }
                },
                {
                    className: 'col-md-3',
                    key: 'SettlementDate',
                    type: 'readonly',
                    templateOptions: {
                        label: 'Settlemet Date'
                    }
                }
            ]
        }
    ];
})