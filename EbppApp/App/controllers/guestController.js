app.controller('guestController',
    function (
        $routeParams,
        $location,
        $scope,
        common,
        achFactory,
        cardFactory,
        guestFactory,
        secureNetTokenFactory,
        secureNetChargeFactory,
        transactionHistoryFactory,
        localStorageService,
        toaster,
        config) {

        var vm = this;
        // function assignment
        vm.onSubmit = onSubmit;

        vm.isProcessing = false;
        vm.merchantId = 1;
        // variable assignment

        vm.achUser = localStorageService.get('achUser');
        vm.author = {
            // optionally fill in your info below :-)
            name: 'Norman Rice, Norman Michael Incorporated, ACH Processing Company',
            url: ''
        };
        vm.exampleTitle = ''; // add this
        vm.env = {
            angularVersion: angular.version.full,
            // formlyVersion: formlyVersion
        };





        vm.model = {
            transactionCode: 27,
            accountNumber: $routeParams.accountNumber,
            firstName: 'Ted',
            lastName: 'Smithson',
            email: 'a@a.com',
            payThisAmount: 99.97,
            invoiceNumber: 'i987',
            ccType: '01',
            ccNumber: '4111111111111111',
            cvv: 999,
            expirationMonth: '04',
            expirationYear: '2021',
            routingNumber: '111901234',
            dfiAccountNumber: '99232'
        };
        vm.options = {};

        common.configErrorHandling($scope, vm, ['email', 'routingNumber', 'dfiAccountNumber']);

        //FUNCTIONS 
        //TODO: Move some into factory?

        function resetHiddenFields() {
            return {
                ach: common.resetHiddenFields(vm).ach,
                card: common.resetHiddenFields(vm).card
            }
        }

        function validationErrors() {
            var validation = guestFactory.validation;
            var model = vm.model;
            var errors = validation.commonFieldErrors(model) || [];

            if (vm.model.cardOrAch === 'card') {
                errors = errors.concat(validation.cardFieldErrors(model));
            }
            else if (vm.model.cardOrAch === 'ach') {
                errors = errors.concat(validation.achFieldErrors(model));
            }

            if (errors.length) {
                common.handleErrors(errors, model, 'Guest Transaction');
                return true;
            }
        }

        function onSubmit() {
            vm.isProcessing = true;

            if (validationErrors()) {
                return;
            }

            var guest = {
                firstName: vm.model.firstName,
                lastName: vm.model.lastName,
                emailAddress: vm.model.email,
                phoneNumber: vm.model.phoneNumber
            }

            guestFactory.createGuest(guest).then(
                function (guestResponse) {
                    //success
                    vm.guestId = guestResponse.data;
                    var isCard = vm.selectCard === "card" ? guestCard() : guestAch();
                },
                function (guestResponse) {
                    //failure
                    toaster.pop({
                        type: 'error',
                        title: 'guestFactory.createGuest(guest)',
                        body: guestResponse,
                        showCloseButton: true
                    });
                });
        };

        function guestCard() {

            var expirationDate = vm.model.expirationMonth + '/' + vm.model.expirationYear;

            var card =
            {
                publicKey: config.secureNetPublicKey,
                card: {
                    number: vm.model.ccNumber,
                    cvv: vm.model.cvv,
                    expirationDate: expirationDate,
                    firstName: vm.model.firstName,
                    lastName: vm.model.lastName,
                    address: {
                        line1: vm.model.line1,
                        zip: vm.model.zip
                    }
                },
                addToVault: false,
                developerApplication: config.developerApplication
            }

            var charge = {
                amount: vm.model.payThisAmount,
                paymentVaultToken: {
                    paymentMethodId: '',
                    publicKey: config.secureNetPublicKey
                },
                extendedInformation: {
                    typeOfGoods: 'PHYSICAL'
                }
            }

            secureNetTokenFactory.createToken(card).then(
                function (tokenResponse) {
                    //success
                    charge.paymentVaultToken.paymentMethodId = secureNetTokenFactory.getTokenValue();

                    secureNetChargeFactory.createCharge(charge).then(
                        function (createChargeResponse) {
                            //success

                            if (createChargeResponse.data.result === 'APPROVED') {
                                var transaction = createChargeResponse.data.transaction;

                                var transactionHistory = {
                                    guestId: vm.guestId,
                                    secureNetId: transaction.secureNetId,
                                    transactionType: transaction.transactionType,
                                    orderId: transaction.orderId,
                                    transactionId: transaction.transactionId,
                                    authorizationCode: transaction.authorizationCode,
                                    authorizedAmount: transaction.authorizedAmount,
                                    allowedPartialCharges: transaction.allowedPartialCharges,
                                    paymentTypeCode: transaction.paymentTypeCode,
                                    paymentTypeResult: transaction.paymentTypeResult,
                                    level2Valid: transaction.level2Valid,
                                    level3Valid: transaction.level3Valid,
                                    transactionDate: transaction.transactionData.date,
                                    transactionAmount: transaction.transactionData.amount,
                                    creditCardType: transaction.creditCardType,
                                    cardNumber: transaction.cardNumber,
                                    avsCode: transaction.avsCode,
                                    avsResult: transaction.avsResult,
                                    cardHolderFirstName: transaction.cardHolder_FirstName,
                                    cardHolderLastName: transaction.cardHolder_LastName,
                                    expirationDate: transaction.expirationDate,
                                    addressLine1: transaction.billAddress.line1,
                                    addressCity: transaction.billAddress.city,
                                    addressState: transaction.billAddress.state,
                                    addressZip: transaction.billAddress.zip,
                                    email: transaction.email,
                                    cardCodeCode: transaction.cardCodeCode,
                                    cardCodeResult: transaction.cardCodeResult,
                                    surchargeAmount: transaction.surchargeAmount,
                                    industrySpecificData: transaction.industrySpecificData,
                                    marketSpecificData: transaction.marketSpecificData,
                                    networkCode: transaction.networkCode,
                                    method: transaction.method
                                };


                                transactionHistoryFactory.writeEbppTransactionHistory(transactionHistory).then(
                                    function (writeEbppTransactionHistoryResponse) {
                                        //success
                                        var url = 'guestChargeResult/' + transaction.authorizationCode;

                                        $location.path(url);
                                    },
                                    function (writeEbppTransactionHistoryResponse) {
                                        //failure

                                        toaster.pop({
                                            type: 'error',
                                            title: 'transactionHistoryFactory.writeEbppTransactionHistory(transactionHistory)',
                                            body: writeEbppTransactionHistoryResponse,
                                            showCloseButton: true
                                        });
                                    });


                            } else {
                                var fail = createChargeResponse.data;
                            }


                        },
                        function (createChargeResponse) {
                            //failure
                            toaster.pop({
                                type: 'error',
                                title: 'secureNetChargeFactory.createCharge(charge)',
                                body: createChargeResponse,
                                showCloseButton: true
                            });
                        });


                }, function (tokenResponse) {
                    alert('token fail');
                });

        };

        function guestAch() {

            var individualName = vm.model.firstName + ' ' + vm.model.lastName;

            var createAchModel = {
                SecCode: 'WEB',
                EntryDescription: moment().format('YYMMDDhhmm'),
                ActionType: 2, //DEBIT
                EffectiveDate: moment(), //set to current date, will be calculated server side
                AccountName: individualName,
                RoutingNumber: vm.model.routingNumber,
                AccountNumber: vm.model.dfiAccountNumber,
                BankingEntryType: vm.model.bankingEntryType,
                Amount: vm.model.payThisAmount,
                AchUser: vm.achUser
            }

            achFactory.processAch(createAchModel).then(
                function (processAchResponse) {
                    //success
                    var data = processAchResponse.data;

                    var last4Account = vm.model.dfiAccountNumber > 4 ? vm.model.dfiAccountNumber.slice(-4) : vm.model.dfiAccountNumber;


                    var achHistory = {
                        GuestId: vm.guestId,
                        RoutingNumber: vm.model.routingNumber,
                        LastFourAccountNumber: last4Account,
                        MerchantId: vm.merchantId,
                        Amount: vm.model.amount,
                        ConfirmationNumber: data.confirmationNumber
                    }

                    achHistoryFactory.writeAchHistory(achHistory).then(
                        function (writeAchHistoryResponse) {
                            //success
                            $location.path('guestAchResult/' + data.confirmationNumber);
                        },
                        function (writeAchHistoryResponse) {
                            //failure
                            toaster.pop({
                                type: 'error',
                                title: 'achHistoryFactory.writeAchHistory(achHistory)',
                                body: writeAchHistoryResponse,
                                showCloseButton: true
                            });
                        }
                    );

                },
                function (processAchResponse) {
                    //failure
                    toaster.pop({
                        type: 'error',
                        title: 'achFactory.processAch(createAchModel)',
                        body: processAchResponse,
                        showCloseButton: true
                    });
                });
        }
    });