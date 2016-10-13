'use strict';


app.controller('paymentDetailController', function (
    $location,
    $routeParams,
    localStorageService,
    toaster,
    paymentDetailFactory,
    paymentDetailEntity
    ) {
    var vm = this;


    vm.refund = refund;

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


    function refund() {
        var refundRequest = {
            TransactionId: 114777806 //vm.model.TransactionId
        }

        paymentDetailFactory.processRefund(refundRequest).then(
            function (processRefundResponse) {
                //success
                toaster.pop({
                    type: 'success',
                    title: 'Refund',
                    body: 'Refund processed sucessfully',
                    showCloseButton: true
                });

                //$location.path('payment');
            },
            function (processRefundResponse) {
                //failure
                toaster.pop({
                    type: 'error',
                    title: 'Refund',
                    body: processRefundResponse,
                    showCloseButton: true
                });
            });
    }
})