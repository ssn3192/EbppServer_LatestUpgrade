'use strict';

app.controller('invoiceController', function (
    $location,
    $scope,
    common,
    localStorageService,
    config,
    toaster,
    invoiceEntity,
    bankDropEntity,
    cardDropEntity,
    paymentMethodFactory,
    cardFactory,
    cardOnFileFactory,
    secureNetChargeFactory,
    transactionHistoryFactory,
    paymentFactory,
    achFactory,
    bankFactory) {
    var vm = this;


    vm.selectPaymentMethodChanged = selectPaymentMethodChanged;
    vm.paymentMethodChanged = paymentMethodChanged;

    vm.processPayment = processPayment;

    var customer = localStorageService.get('customer');
    vm.customerId = customer.customerId;

    vm.merchantId = localStorageService.get('merchantId');
    vm.achUser = localStorageService.get('achUser');

    var cardData = '';
    var arrCard = [{ name: '{Add Card}', value: 'Add Card' }];
    var bankData = '';
    var arrBank = [{ name: '{Add Bank}', value: 'Add Bank' }];

    if (angular.isDefined(cardDropEntity)) {
        cardData = cardDropEntity.data;

        for (var x in cardData) {
            if (cardData.hasOwnProperty(x)) {
                arrCard.push(cardData[x]);
            }
        }
    }

    if (angular.isDefined(bankDropEntity)) {
        bankData = bankDropEntity.data;

        for (var y in bankData) {
            if (bankData.hasOwnProperty(y)) {
                arrBank.push(bankData[y]);
            }
        }
    }

    vm.select = {
        cards: arrCard,
        banks: arrBank

    }


    vm.model = invoiceEntity;
    vm.model.paymentMethod = 'unknown';
    vm.model.showTerms = 'unknown';
    vm.model.payThisAmount = vm.model.amountDue;
    vm.options = {};
    vm.model.cardfee = 2.5;
    vm.model.achfee = 3.5;

    common.configErrorHandling($scope, vm);

  
    function processPayment() {
        if (vm.model.isCard) {
            processCardCharge();
        } else {
            processBankCharge();
        }
    }

    function processCardCharge() {

        var token = vm.model.selectPaymentMethodCard;


        var chargeRequest = {
            amount: vm.model.payThisAmount,
            paymentVaultToken: {
                customerId: vm.secureNetCustomerId,
                paymentMethodId: token,
                publicKey: config.secureNetPublicKey,
                paymentType: 'CREDIT_CARD'
            },
            extendedInformation: {
                typeOfGoods: 'PHYSICAL'
            },
            developerApplication: config.developerApplication
        }

        secureNetChargeFactory.createCharge(chargeRequest).then(
            function (createChargeResponse) {
                //success

                var data = createChargeResponse.data.transaction;

                vm.chargeResult = createChargeResponse.data.result;


                if (vm.chargeResult === 'APPROVED') {

                    var paymentRequest = {
                        customerId: vm.customerId,
                        merchantId: 1,
                        paymentTypeResult: data.paymentTypeResult,
                        paymentDate: data.transactionData.date,
                        amount: data.authorizedAmount,
                        accountNumber: data.cardNumber,
                        status: vm.chargeResult,
                        confirmationNumber: data.authorizationCode,
                        settlementDate: null
                    }
                    paymentFactory.postPayment(paymentRequest).then(
                        function (postPaymentResponse) {
                            //success
                            var urlPath = 'customerChargeResult/' + encodeURIComponent(data.authorizationCode);
                            $location.path(urlPath);
                        },
                        function (postPaymentResponse) {
                            //failure
                        });
                } else {

                    var message = vm.chargeResult + ': ' + createChargeResponse.data.message;

                    toaster.pop({
                        type: 'error',
                        title: 'createCharge',
                        body: message,
                        showCloseButton: true
                    });
                }

            }, function (createChargeResponse) {
                //failure
            });

    }

    function processBankCharge() {

        var bankId = vm.model.selectPaymentMethodBank;

        bankFactory.getBank(bankId).then(
            function (getbankResponse) {
                //success
                var bank = getbankResponse.data;

                var accountType = bank.isChecking ? 1 : 2;

                var createAchModel = {
                    SecCode: 'WEB',
                    EntryDescription: moment().format('YYMMDDhhmm'),
                    ActionType: 2, //DEBIT
                    EffectiveDate: moment(), //set to current date, will be calculated server side
                    AccountName: bank.bankAccountName,
                    RoutingNumber: bank.routingNumber,
                    AccountNumber: bank.dfiAccountNumber,
                    AccountType: accountType,
                    Amount: vm.model.payThisAmount,
                    AchUser: vm.achUser
                }

                achFactory.processAch(createAchModel).then(
                    function (processAchResponse) {
                        //success

                        var data = processAchResponse.data;

                        //var last4 = bank.DfiAccountNumber.slice(-4);

                        //var achHistory = {
                        //    CustomerId: vm.customerId,
                        //    RoutingNumber: bank.routingNumber,
                        //    LastFourAccountNumber: last4,
                        //    MerchantGuid: vm.merchantGuid,
                        //    Amount: vm.model.payThisAmount,
                        //    ConfirmationNumber: data.ConfirmationNumber
                        //}

                        //achHistoryFactory.writeAchHistory(achHistory).then(
                        //    function (writeAchHistoryResponse) {
                        //        //success
                        $location.path('customerAchResult/' + data.confirmationNumber);
                        //    },
                        //    function (writeAchHistoryResponse) {
                        //        //failure
                        //        var f = writeAchHistoryResponse;
                        //    }
                        //);

                    },
                    function (processAchResponse) {
                        //failure
                        var f = processAchResponse;
                    });


            },
            function (getbankResponse) {
                //failure
            });
    }

    function createCardPayment(transaction) {


    }

    function selectPaymentMethodChanged() {
        var paymentMethod = vm.model.selectPaymentMethod;

        var dummy = paymentMethod === "Add Card" ? $location.path('card') : paymentMethod === "Add Bank" ? $location.path('bank') : '';
    }

    function paymentMethodChanged() {

        vm.selectPaymentAccount = '';

        var cards = vm.select.cards;

        var banks = vm.select.banks;

        if (vm.model.paymentMethod === 'card') {
            vm.selectPaymentAccount = cards;
        } else if (vm.model.paymentMethod === 'ach') {
            vm.selectPaymentAccount = banks;
        }
    }

});