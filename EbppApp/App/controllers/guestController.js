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
        achHistoryFactory,
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

        //vm.fields = [
        //    {
        //        className: 'section-label',

        //        template: '<div><strong>Name:</strong></div><hr/>'

        //    }, {
        //        className: 'row',
        //        fieldGroup: [
        //            {
        //                className: 'col-md-3',
        //                key: 'firstName',
        //                type: 'input',
        //                templateOptions: {
        //                    type: 'text',
        //                    label: 'First Name *',
        //                    placeholder: 'Enter your First Name',
        //                    onBlur: common.coerceInitialValidation('firstName')
        //                },
        //                validators: {
        //                    firstName: function () {
        //                        return common.validate('requiredValue', arguments, vm, 'First Name is required');
        //                    }
        //                }
        //            }, {
        //                className: 'col-md-3',
        //                key: 'lastName',
        //                type: 'input',
        //                templateOptions: {
        //                    type: 'text',
        //                    label: 'Last *',
        //                    placeholder: 'Enter your last name',
        //                    onBlur: common.coerceInitialValidation('lastName')
        //                },
        //                validators: {
        //                    lastName: function () {
        //                        return common.validate('requiredValue', arguments, vm, 'Last Name is required');
        //                    }
        //                }
        //            }
        //        ]
        //    }, {
        //        className: 'section-label',
        //        template: '<div><strong>Contact Information:</strong></div><hr/>'
        //    },
        //    {
        //        className: 'row',
        //        fieldGroup: [
        //            {
        //                key: 'email',
        //                type: 'input',
        //                templateOptions: {
        //                    label: 'Email *',
        //                    type: 'text',
        //                    placeholder: 'Enter email',
        //                    onBlur: common.coerceInitialValidation('email')
        //                },
        //                validators: {
        //                    email: function () {
        //                        return common.validate('matchingValue', arguments, vm, 'Email is not valid', common.EMAIL_PATTERN);
        //                    }
        //                }
        //            }, {
        //                key: 'phoneNumber',
        //                type: 'input',
        //                templateOptions: {
        //                    label: 'Phone',
        //                    placeholder: 'Enter phone'
        //                },
        //                validators: {
        //                    phoneNumber: function () {
        //                        return common.validate('optionalMatch', arguments, vm, 'Phone number is not valid', common.isPhoneNumber);
        //                    }
        //                }
        //            }
        //        ]

        //    },
        //    {
        //        className: 'section-label',
        //        template: '<div><strong>Invoice:</strong></div><hr/>'
        //    },
        //    {
        //        className: 'row',
        //        fieldGroup: [
        //            {
        //                key: 'payThisAmount',
        //                type: 'currency',
        //                templateOptions: {
        //                    label: 'Amount',
        //                    placeholder: 'Enter amount',
        //                    onBlur: common.coerceInitialValidation('payThisAmount')
        //                },
        //                validators: {
        //                    payThisAmount: function () {
        //                        return common.validate('requiredValue', arguments, vm, 'Amount is required');
        //                    }
        //                }
        //            },
        //            {
        //                key: 'accountNumber',
        //                type: 'readonly',
        //                templateOptions: {
        //                    label: 'Account #',
        //                    placeholder: 'Enter account number'
        //                }
        //            },
        //            {
        //                key: 'invoiceNumber',
        //                type: 'input',
        //                templateOptions: {
        //                    label: 'Invoice #',
        //                    placeholder: 'Enter invoice number (optional)'
        //                }
        //            }
        //        ]
        //    }, {
        //        className: 'row',
        //        fieldGroup: [
        //            {
        //                className: 'col-md-3',
        //                key: 'cardOrAch',
        //                type: 'radio',
        //                templateOptions: {
        //                    label: 'Payment Method',
        //                    required: true,
        //                    options: [
        //                        { name: 'Card', value: 'card' },
        //                        { name: 'ACH', value: 'ach' }
        //                    ],
        //                    onClick: function () { vm.model.cardOrAch === 'card' ? resetHiddenFields().ach() : resetHiddenFields().card() }
        //                }
        //            }
        //        ]
        //    },
        //    {
        //        className: 'section-label',

        //        template: '<div><strong>Card:</strong></div><hr/>',
        //        hideExpression: 'model.cardOrAch !== "card"'

        //    },
        //    {
        //        className: 'row',

        //        fieldGroup: [
        //            {
        //                className: 'col-md-3',
        //                key: 'ccType',
        //                type: 'select',
        //                templateOptions: {
        //                    label: 'Type *',
        //                    options: [
        //                        { name: 'Visa', value: '01' },
        //                        { name: 'American Express', value: '02' },
        //                        { name: 'MasterCard', value: '03' }
        //                    ],
        //                    onBlur: common.coerceInitialValidation('ccType')
        //                },
        //                validators: {
        //                    ccType: function () {
        //                        return common.validate('matchingValue', arguments, vm, 'Please select a Credit Card Type', /^01|02|03$/);
        //                    }
        //                }
        //            }, {
        //                className: 'col-md-4',
        //                key: 'ccNumber',
        //                type: 'creditCard',
        //                templateOptions: {
        //                    label: 'Number',
        //                    required: true //,
        //                    //placeholder: 'Enter a valid card number'
        //                },
        //                expressionProperties: {
        //                    // The following does not work at all on our page, and is broken at: http://angular-formly.com/#/example/integrations/angular-credit-card
        //                    // Have opened an issue at: https://github.com/formly-js/angular-formly/issues/684
        //                    //'templateOptions.placeholder': "\"Enter a valid \" + to.ccType + \" card number\""
        //                    'templateOptions.ccType': 'formState.ccType'
        //                }
        //            },
        //            {
        //                className: 'col-md-3',
        //                key: 'cvv',
        //                type: 'input',
        //                templateOptions: {
        //                    type: 'text',
        //                    label: 'Cvv *',
        //                    placeholder: 'Enter cvv for card',
        //                    onBlur: common.coerceInitialValidation('cvv')
        //                },
        //                validators: {
        //                    cvv: function () {
        //                        return common.validate('matchingValue', arguments, vm, 'Please enter a valid Cvv Number', /^\d{3,4}$/);
        //                    }
        //                }
        //            }, {
        //                className: 'col-md-3',
        //                key: 'expirationMonth',
        //                type: 'select',
        //                templateOptions: {
        //                    label: 'Month *',
        //                    options: cardFactory.expiryMonthOptions(),
        //                    onBlur: common.coerceInitialValidation('expirationMonth')
        //                },
        //                validators: {
        //                    expirationMonth: function () {                          // See http://stackoverflow.com/a/2137959/34806 for regex
        //                        return common.validate('matchingValue', arguments, vm, 'Please select an Expiration Month', /^(0?[1-9]|1[012])$/);
        //                    }
        //                }
        //            },
        //            {
        //                className: 'col-md-3',
        //                key: 'expirationYear',
        //                type: 'select',
        //                templateOptions: {
        //                    label: 'Year *',
        //                    options: cardFactory.expiryYearOptions(),
        //                    onBlur: common.coerceInitialValidation('expirationYear')
        //                },
        //                validators: {
        //                    expirationYear: function () {
        //                        return common.validate('matchingValue', arguments, vm, 'Please select an Expiration Year', /^20[1-9]\d$/);
        //                    }
        //                }
        //            }
        //        ],
        //        hideExpression: 'model.cardOrAch !== "card"'
        //    }, {
        //        className: 'section-label',

        //        template: '<div><strong>ACH:</strong></div><hr/>',
        //        hideExpression: 'model.cardOrAch !== "ach"'

        //    }, {
        //        className: 'row',
        //        fieldGroup: [
        //            {
        //                className: 'col-md-3',
        //                key: 'routingNumber',
        //                type: 'input',
        //                templateOptions:
        //                {
        //                    label: 'Routing # *',
        //                    onBlur: common.coerceInitialValidation('routingNumber')
        //                },
        //                validators: {
        //                    routingNumber: function () {
        //                        return common.validate('matchingValue', arguments, vm, 'Routing Number must be nine digits', /^\d{9}$/);
        //                    }
        //                }
        //            },
        //            {
        //                className: 'col-md-3',
        //                key: 'dfiAccountNumber',
        //                type: 'input',
        //                templateOptions:
        //                {
        //                    required: true,
        //                    label: 'Account #',
        //                    onBlur: common.coerceInitialValidation('dfiAccountNumber')
        //                },
        //                validators: {
        //                    dfiAccountNumber: function () {                             // http://stackoverflow.com/a/1540314/34806
        //                        return common.validate('matchingValue', arguments, vm, 'Account Number must be between four and seventeen digits', /^\d{4,17}$/);
        //                    }
        //                }
        //            },
        //            {
        //                className: 'col-md-3',
        //                key: 'accountType',
        //                type: 'select',
        //                templateOptions:
        //                {
        //                    required: true,
        //                    label: 'Account Type',
        //                    options: [
        //                        { name: 'Checking', value: 1 },
        //                        { name: 'Savings', value: 2 }
        //                    ],
        //                    onBlur: common.coerceInitialValidation('accountType')
        //                },
        //                validators: {
        //                    accountType: function () {
        //                        return common.validate('matchingValue', arguments, vm, 'Please select Account Type of either Checking or Savings', /^1|2$/);
        //                    }
        //                }
        //            }
        //        ],
        //        hideExpression: 'model.cardOrAch !== "ach"'
        //    }
        //];


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