'use strict';

app.provider('localStorageProvider', function () {
    var vm = this;

    vm.$get = [
        'localStorageHost', function localStorageFactory(localStorageHost) {
            return new MyLocalStorageService(localStorageHost);
        }
    ];
});

function MyLocalStorageService(localStorageHost, localStorageService) {
    var customer = {
        customerId: localStorageService.get('customerId'),
        customerGuid: localStorageService.get('customerGuid'),
        firstName: localStorageService.get('firstName'),
        lastName: localStorageService.get('lastName'),
        phoneNumber: localStorageService.get('phoneNumber'),
        emailAddress: localStorageService.get('emailAddress'),
        sendEmailReceipts: localStorageService.get('sendEmailReceipts'),
        notes: localStorageService.get('notes'),
        addressLine1: localStorageService.get('addressLine1'),
        addressCity: localStorageService.get('addressCity'),
        addressState: localStorageService.get('addressState'),
        addressZip: localStorageService.get('addressZip'),
        company: localStorageService.get('company'),
        secureNetCustomerId: localStorageService.get('secureNetCustomerId')
    };

    var getCustomer = function () {
        return $q.when(customer);
    }




}