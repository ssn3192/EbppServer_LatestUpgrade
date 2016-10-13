'use strict';

app.config(function ($routeProvider) {

    $routeProvider
        .when('/admin', {
            templateUrl: 'App/partials/admin.html',
            controller: 'adminController',
            controllerAs: 'vm'
        })
        .when('/bank', {
            templateUrl: 'App/partials/bank.html',
            controller: 'bankController',
            controllerAs: 'vm'
        })
        .when('/bankOnFile', {
            templateUrl: 'App/partials/bankOnFile.html',
            controller: 'bankOnFileController',
            controllerAs: 'vm'
        })
        .when('/card', {
            templateUrl: 'App/partials/card.html',
            controller: 'cardController',
            controllerAs: 'vm'
        })
        .when('/cardOnFile', {
            templateUrl: 'App/partials/cardOnFile.html',
            controller: 'cardOnFileController',
            controllerAs: 'vm'
        })
        .when('/customer', {
            templateUrl: 'App/partials/customer.html',
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
            templateUrl: 'App/partials/customerAchResult.html',
            controller: 'customerAchResultController',
            controllerAs: 'vm'
        })
        .when('/customerChargeResult/:authorizationCode', {
            templateUrl: 'App/partials/customerChargeResult.html',
            controller: 'customerChargeResultController',
            controllerAs: 'vm'
        })
        .when('/customerPayment', {
            templateUrl: 'App/partials/customerPayment.html',
            controller: 'customerPaymentController',
            controllerAs: 'vm'
        })
        .when('/customerPaymentDetail/:transactionId?', {
            templateUrl: 'App/partials/customerPaymentDetail.html',
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
            templateUrl: 'App/partials/guest.html',
            controller: 'guestController',
            controllerAs: 'vm'
        })
        .when('/guestAccount', {
            templateUrl: 'App/partials/guestAccount.html',
            controller: 'guestAccountController',
            controllerAs: 'vm'
        })
        .when('/guestAchResult/:confirmationNumber', {
            templateUrl: 'App/partials/guestAchResult.html',
            controller: 'guestAchResultController',
            controllerAs: 'vm'
        })
        .when('/guestChargeResult/:authorizationCode', {
            templateUrl: 'App/partials/guestChargeResult.html',
            controller: 'guestChargeResultController',
            controllerAs: 'vm'
        })
        .when('/history/:merchantGuid?/:customerGuid?', {
            templateUrl: 'App/partials/history.html',
            controller: 'historyController',
            controllerAs: 'vm'
        })
        .when('/insufficient', {
            templateUrl: 'App/partials/insufficient.html',
            controller: 'insufficientController',
            controllerAs: 'vm'
        })
        .when('/invoice', {
            templateUrl: 'App/partials/invoice.html',
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
            templateUrl: 'App/partials/merchantImport.html',
            controller: 'merchantImportController',
            controllerAs: 'vm'
        })
        .when('/login', {
            templateUrl: 'App/templates/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .when('/logout', {
            templateUrl: 'App/partials/signout.html',
            controller: 'signoutController',
            controllerAs: 'vm'
        })
        .when('/payment', {
            templateUrl: 'App/partials/payment.html',
            controller: 'paymentController',
            controllerAs: 'vm'
        })
        .when('/paymentDetail/:transactionId?', {
            templateUrl: 'App/partials/paymentDetail.html',
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
            templateUrl: 'App/partials/preRegister.html',
            controller: 'preRegisterController',
            controllerAs: 'vm'
        })
        .when('/signout', {
            templateUrl: 'App/partials/signout.html',
            controller: 'signoutController',
            controllerAs: 'vm'
        })
        .when('/register', {
            templateUrl: 'App/partials/register.html',
            controller: 'registerController',
            controllerAs: 'vm'
        })
        .when('/token/:merchantGuid/:merchantApiKey', {
            templateUrl: 'App/partials/token.html',
            controller: 'tokenController',
            controllerAs: 'vm'
        })
        .when('/transactionHistory/:merchantGuid?/:customerGuid?', {
            templateUrl: 'App/partials/transactionHistory.html',
            controller: 'transactionHistoryController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/login'
        });
});