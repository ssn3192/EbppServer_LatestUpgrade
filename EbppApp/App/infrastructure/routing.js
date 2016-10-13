'use strict';

app.config(function ($routeProvider) {

    $routeProvider
        .when('/admin', {
            templateUrl: 'app/partials/admin.html',
            controller: 'adminController',
            controllerAs: 'vm'
        })
        .when('/bank', {
            templateUrl: 'app/partials/bank.html',
            controller: 'bankController',
            controllerAs: 'vm'
        })
        .when('/bankOnFile', {
            templateUrl: 'app/partials/bankOnFile.html',
            controller: 'bankOnFileController',
            controllerAs: 'vm'
        })
        .when('/card', {
            templateUrl: 'app/partials/card.html',
            controller: 'cardController',
            controllerAs: 'vm'
        })
        .when('/cardOnFile', {
            templateUrl: 'app/partials/cardOnFile.html',
            controller: 'cardOnFileController',
            controllerAs: 'vm'
        })
        .when('/customer', {
            templateUrl: 'app/partials/customer.html',
            controller: 'customerController',
            controllerAs: 'vm',
            resolve: {
                customerModel: function (customerFactory) {
                    var customer = customerFactory.getLocalStorageCustomer();
                    return customer;
                }
            }
        })
        .when('/customerAchResult/:confirmationNumber', {
            templateUrl: 'app/partials/customerAchResult.html',
            controller: 'customerAchResultController',
            controllerAs: 'vm'
        })
        .when('/customerChargeResult/:authorizationCode', {
            templateUrl: 'app/partials/customerChargeResult.html',
            controller: 'customerChargeResultController',
            controllerAs: 'vm'
        })
        .when('/customerPayment', {
            templateUrl: 'app/partials/customerPayment.html',
            controller: 'customerPaymentController',
            controllerAs: 'vm'
        })
        .when('/customerPaymentDetail/:transactionId?', {
            templateUrl: 'app/partials/customerPaymentDetail.html',
            controller: 'customerPaymentDetailController',
            controllerAs: 'vm',
            resolve: {
                paymentDetailEntity: function ($filter, $route, localStorageService) {
                    var transactionId = parseInt($route.current.params.transactionId, 10);
                    var gridData = localStorageService.get('customerPaymentGrid');

                    var selected = 0;

                    selected = $filter('filter')(gridData,
                        function (d) {
                            var t = d.TransactionId;
                            return d.TransactionId === transactionId;
                        })[0];

                    return selected;
                }
            }
        })
        .when('/guest/:accountNumber/:merchantGuid?', {
            templateUrl: 'app/partials/guest.html',
            controller: 'guestController',
            controllerAs: 'vm'
        })
        .when('/guestAccount', {
            templateUrl: 'app/partials/guestAccount.html',
            controller: 'guestAccountController',
            controllerAs: 'vm'
        })
        .when('/guestAchResult/:confirmationNumber', {
            templateUrl: 'app/partials/guestAchResult.html',
            controller: 'guestAchResultController',
            controllerAs: 'vm'
        })
        .when('/guestChargeResult/:authorizationCode', {
            templateUrl: 'app/partials/guestChargeResult.html',
            controller: 'guestChargeResultController',
            controllerAs: 'vm'
        })
        .when('/history/:merchantGuid?/:customerGuid?', {
            templateUrl: 'app/partials/history.html',
            controller: 'historyController',
            controllerAs: 'vm'
        })
        .when('/insufficient', {
            templateUrl: 'app/partials/insufficient.html',
            controller: 'insufficientController',
            controllerAs: 'vm'
        })
        .when('/invoice', {
            templateUrl: 'app/partials/invoice.html',
            controller: 'invoiceController',
            controllerAs: 'vm',
            resolve: {
                invoiceEntity: function (invoiceFactory) {
                    var invoice = invoiceFactory.getLocalStorageInvoice();
                    return invoice;
                },
                cardDropEntity: function (paymentMethodFactory) {
                    var cardDrop = paymentMethodFactory.getPaymentMethodCard();
                    return cardDrop;
                },
                bankDropEntity: function (paymentMethodFactory) {
                    var bankDrop = paymentMethodFactory.getPaymentMethodBank();
                    return bankDrop;
                }
            }
        })
        .when('/merchantImport', {
            templateUrl: 'app/partials/merchantImport.html',
            controller: 'merchantImportController',
            controllerAs: 'vm'
        })
        .when('/login', {
            templateUrl: 'app/partials/login.html',
            controller: 'loginController',
            controllerAs: 'vm'
        })
        .when('/logout', {
            templateUrl: 'app/partials/signout.html',
            controller: 'signoutController',
            controllerAs: 'vm'
        })
        .when('/payment', {
            templateUrl: 'app/partials/payment.html',
            controller: 'paymentController',
            controllerAs: 'vm'
        })
        .when('/paymentDetail/:transactionId?', {
            templateUrl: 'app/partials/paymentDetail.html',
            controller: 'paymentDetailController',
            controllerAs: 'vm',
            resolve: {
                paymentDetailEntity: function ($filter, $route, localStorageService) {
                    var transactionId = parseInt($route.current.params.transactionId, 10);
                    var gridData = localStorageService.get('merchantPaymentGrid');

                    var selected = 0;

                    selected = $filter('filter')(gridData, function (d) { return d.TransactionId === transactionId; })[0];

                    return selected;
                }
            }
        })
        .when('/preRegister', {
            templateUrl: 'app/partials/preRegister.html',
            controller: 'preRegisterController',
            controllerAs: 'vm'
        })
        .when('/signout', {
            templateUrl: 'app/partials/signout.html',
            controller: 'signoutController',
            controllerAs: 'vm'
        })
        .when('/register', {
            templateUrl: 'app/partials/register.html',
            controller: 'registerController',
            controllerAs: 'vm'
        })
        .when('/token/:merchantGuid/:merchantApiKey', {
            templateUrl: 'app/partials/token.html',
            controller: 'tokenController',
            controllerAs: 'vm'
        })
        .when('/transactionHistory/:merchantGuid?/:customerGuid?', {
            templateUrl: 'app/partials/transactionHistory.html',
            controller: 'transactionHistoryController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/login'
        });
});