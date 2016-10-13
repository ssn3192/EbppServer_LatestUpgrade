'use strict';

app.controller('cardController', function cardController(
    $routeParams,
    $location,
    $scope,
    common,
    cardFactory,
    customerFactory,
    secureNetCustomerFactory,
    secureNetTokenFactory,
    localStorageService,
    toaster,
    config) {

    var vm = this;

    vm.save = save;

    vm.accountNumber = localStorageService.get('accountNumber');

    var customer = localStorageService.get('customer');
    vm.customerId = customer.customerId;

    vm.model = {
        customerId: vm.customerId,
        nickname: 'c1',
        firstName: 'Cat',
        lastName: 'Jones',
        ccType: '01',
        ccNumber: '4111111111111111',
        cvv: 999,
        expirationMonth: '04',
        expirationYear: '2021',
        addressZip: 75075
    };

    common.configErrorHandling($scope, vm, ['ccNumber', 'cvv', 'addressZip']);


    //FUNCTIONS

    function save() {

        //GET CUSTOMER

        var secureNetCustomer = {
            firstName: customer.firstName,
            lastName: customer.lastName,
            phoneNumber: customer.phoneNumber,
            emailAddress: customer.emailAddress,
            sendEmailReceipts: customer.sendEmailReceipts,
            notes: customer.notes,
            addressLine1: customer.addressLine1,
            addressCity: customer.addressCity,
            addressState: customer.addressState,
            addressZip: customer.addressZip,
            company: customer.company
        };

        cardFactory.cardCount(vm.customerId).then(
            function (cardCountResponse) {
                //success

                //IS THIS FIRST CARD

                var count = cardCountResponse.data;

                if (count === 0) {
                    //FIRST CARD
                    //INSERT CUSTOMER TO SECURENET
                    secureNetCustomerFactory.createCustomer(secureNetCustomer).then(
                        function (createCustomerResponse) {
                            //success

                            //UPDATE EBPP CUSTOMER WITH SECURENETCUSTOMERID
                            customer.secureNetCustomerId = createCustomerResponse.data.customerId;

                            customerFactory.updateCustomer(customer).then(
                                function (updateCustomerResponse) {
                                    //success
                                    insertCard(true);

                                },
                                function (updateCustomerResponse) {
                                    //failure
                                    toaster.pop({
                                        type: 'error',
                                        title: 'updateCustomer',
                                        body: updateCustomerResponse,
                                        showCloseButton: true
                                    });
                                });
                        },
                        function (createCustomerResponse) {
                            //failure
                            toaster.pop({
                                type: 'error',
                                title: 'createCustomer',
                                body: createCustomerResponse,
                                showCloseButton: true
                            });
                        });

                } else {
                    insertCard(false);
                }

            }, function (cardCountResponse) {
                //failure
                toaster.pop({
                    type: 'error',
                    title: 'cardCount',
                    body: cardCountResponse,
                    showCloseButton: true
                });
            });
    }//save


    function insertCard(isPrimary) {
        //INSERT CARD TO SECURENET VAULT
        var expirationDate = vm.model.expirationMonth + '/' + vm.model.expirationYear;

        var secureNetCard =
        {
            customerId: vm.secureNetCustomerId,
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
            addToVault: true,
            developerApplication: config.developerApplication
        };

        secureNetTokenFactory.createToken(secureNetCard).then(
            function (getTokenResponse) {
                //success
                //INSERT CARD TO EBPP

                vm.secureNetToken = getTokenResponse.token;
                vm.secureNetCustomerId = getTokenResponse.customerId;

                var last4 = vm.model.ccNumber.slice(-4);


                var ebppCard = {
                    customerId: vm.customerId,
                    nickname: vm.model.nickname,
                    lastFourDigits: last4,
                    expirationDate: expirationDate,
                    creditCardType: vm.model.ccType,
                    secureNetToken: vm.secureNetToken,
                    isPrimary: isPrimary
                };

                localStorageService.set('secureNetToken', vm.secureNetToken);
                localStorageService.set('last4', last4);
                localStorageService.set('expirationDate', expirationDate);

                if (getTokenResponse.success) {
                    cardFactory.insertCard(ebppCard).then(
                        function (insertCardResponse) {
                            //success
                            var history = localStorageService.get('history') === null ? [] : localStorageService.get('history');
                            var previousPage = history.slice(-1)[0];
                            $location.path(previousPage);
                        },
                        function (insertCardResponse) {
                            //failure
                            toaster.pop({
                                type: 'error',
                                title: 'insertCard',
                                body: insertCardResponse,
                                showCloseButton: true
                            });
                        });
                } else {
                    var ouch = getTokenResponse;

                    toaster.pop({
                        type: 'error',
                        title: 'insertCard',
                        body: getTokenResponse,
                        showCloseButton: true
                    });
                }
            },
            function (getTokenResponse) {
                //failure
                toaster.pop({
                    type: 'error',
                    title: 'getToken',
                    body: getTokenResponse,
                    showCloseButton: true
                });
            });
    }
});