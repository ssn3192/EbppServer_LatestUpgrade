'use strict';

app.config(function ($routeProvider) {

    $routeProvider
        .when('/admin', {
            templateUrl: 'App/templates/admin.html',
            controller: 'adminController',
            controllerAs: 'vm'
        })
         .when('/customerAccount', {
             templateUrl: 'App/templates/customerAccount.html',
             controller: 'customeraccountController',
             controllerAs: 'vm'
         })
        .when('/bank', {
            templateUrl: 'App/templates/bank.html',
            controller: 'bankController',
            controllerAs: 'vm'
        })
        .when('/bankOnFile', {
            templateUrl: 'App/templates/bankOnFile.html',
            controller: 'bankOnFileController',
            controllerAs: 'vm'
        })
        .when('/card', {
            templateUrl: 'App/templates/card.html',
            controller: 'cardController',
            controllerAs: 'vm'
        })
        .when('/cardOnFile', {
            templateUrl: 'App/templates/cardOnFile.html',
            controller: 'cardOnFileController',
            controllerAs: 'vm'
        })
        .when('/customer', {
            templateUrl: 'App/templates/customer.html',
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
            templateUrl: 'App/templates/customerAchResult.html',
            controller: 'customerAchResultController',
            controllerAs: 'vm'
        })
        .when('/customerChargeResult/:authorizationCode', {
            templateUrl: 'App/templates/customerChargeResult.html',
            controller: 'customerChargeResultController',
            controllerAs: 'vm'
        })
        .when('/customerPayment', {
            templateUrl: 'App/templates/customerPayment.html',
            controller: 'customerPaymentController',
            controllerAs: 'vm'
        })
        .when('/customerPaymentDetail/:transactionId?', {
            templateUrl: 'App/templates/customerPaymentDetail.html',
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
            templateUrl: 'App/templates/guest.html',
            controller: 'guestController',
            controllerAs: 'vm'
        })
        .when('/guestAccount', {
            templateUrl: 'App/templates/guestAccount.html',
            controller: 'guestAccountController',
            controllerAs: 'vm'
        })
        .when('/guestAchResult/:confirmationNumber', {
            templateUrl: 'App/templates/guestAchResult.html',
            controller: 'guestAchResultController',
            controllerAs: 'vm'
        })
        .when('/guestChargeResult/:authorizationCode', {
            templateUrl: 'App/templates/guestChargeResult.html',
            controller: 'guestChargeResultController',
            controllerAs: 'vm'
        })
        .when('/history/:merchantGuid?/:customerGuid?', {
            templateUrl: 'App/templates/history.html',
            controller: 'historyController',
            controllerAs: 'vm'
        })
        .when('/insufficient', {
            templateUrl: 'App/templates/insufficient.html',
            controller: 'insufficientController',
            controllerAs: 'vm'
        })
        .when('/invoice', {
            templateUrl: 'App/templates/invoice.html',
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
            templateUrl: 'App/templates/merchantImport.html',
            controller: 'merchantImportController',
            controllerAs: 'vm'
        })
        .when('/login', {
            templateUrl: 'App/templates/login.html',
            controller: 'loginController',
            controllerAs: 'vm'
        })
        .when('/logout', {
            templateUrl: 'App/templates/signout.html',
            controller: 'signoutController',
            controllerAs: 'vm'
        })
        .when('/payment', {
            templateUrl: 'App/templates/payment.html',
            controller: 'paymentController',
            controllerAs: 'vm'
        })
        .when('/paymentDetail/:transactionId?', {
            templateUrl: 'App/templates/paymentDetail.html',
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
            templateUrl: 'App/templates/preRegister.html',
            controller: 'preRegisterController',
            controllerAs: 'vm'
        })
        .when('/signout', {
            templateUrl: 'App/templates/signout.html',
            controller: 'signoutController',
            controllerAs: 'vm'
        })
        .when('/register', {
            templateUrl: 'App/templates/register.html',
            controller: 'registerController',
            controllerAs: 'vm'
        })
        .when('/token/:merchantGuid/:merchantApiKey', {
            templateUrl: 'App/templates/token.html',
            controller: 'tokenController',
            controllerAs: 'vm'
        })
        .when('/transactionHistory/:merchantGuid?/:customerGuid?', {
            templateUrl: 'App/templates/transactionHistory.html',
            controller: 'transactionHistoryController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/login'
        });
});