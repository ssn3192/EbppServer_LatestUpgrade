app.controller('customerController', function (
    $routeParams,
    $location,
    $scope,
    common,
    customerFactory,
    cardFactory,
    bankFactory,
    localStorageService,
    toaster,
    customerModel
    ) {

    var vm = this;
    vm.options = {};
    vm.model = {};
    vm.save = save;
    vm.cardRedirect = cardRedirect;
    vm.bankRedirect = bankRedirect;
    vm.isLoggedIn = true;
    // function assignment

    //route params

    //TODO:
    //LOAD CUSTOMER
    //vm.model = customerModel;

    var customer = localStorageService.get('customer');
    vm.customerId = customer.customerId;

    vm.model = {
        customerId: customer.customerId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phone,
        emailAddress: customer.emailAddress,
        sendEmailReceipts: customer.sendEmailReceipts,
        addressLine1: customer.addressLine1,
        addressCity: customer.addressCity,
        addressState: customer.addressState,
        addressZip: customer.addressZip,
        addressCountry: customer.addressCountry,
        addressPhone: customer.addressPhone,
        addressCompany: customer.addressCompany
    };




    // variable assignment
    vm.author = {
        name: 'Norman Rice: Norman Michael Incorporated, ACH Processing Company',
        url: 'http://achprocessing.com'
    };
    vm.Title = 'Click Here To Pay Money';

    vm.options = {};

    common.configErrorHandling($scope, vm, ['emailAddress']);

 
    // FUNCTIONS

    function save() {
        customerFactory.updateCustomer(vm.model).then(
            function (updateCustomerResponse) {
                //success
                toaster.pop({
                    type: 'success',
                    title: 'Customer',
                    body: 'Update successful',
                    showCloseButton: true
                });
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
    }

    function cardRedirect() {
        //CHECK FOR CARD

        cardFactory.cardCount(vm.customerId).then(
            function (cardCountResponse) {
                //success

                //COUNT > 0 ROUTE TO CARDONFILE ELSE ROUTE TO CARD

                if (cardCountResponse.data > 0) {
                    $location.path('cardOnFile');
                } else {
                    $location.path('card');
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
    }

    function bankRedirect() {
        bankFactory.bankCount(vm.model.customerId).then(
            function (bankCountResponse) {
                //success

                //COUNT > 0 ROUTE TO CARDONFILE ELSE ROUTE TO CARD

                if (bankCountResponse.data > 0) {
                    $location.path('bankOnFile');
                } else {
                    $location.path('bank');
                }

            }, function (bankCountResponse) {
                //failure
                toaster.pop({
                    type: 'error',
                    title: 'bankCount',
                    body: bankCountResponse,
                    showCloseButton: true
                });
            });
    }
});