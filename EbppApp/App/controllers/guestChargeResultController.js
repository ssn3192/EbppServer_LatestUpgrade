'use strict';

app.controller('guestChargeResultController', function ($routeParams) {
    var vm = this;

    vm.model = {
        transactionId: $routeParams.transactionId,
        authorizationCode: $routeParams.authorizationCode,
        card: $routeParams.card
    }

});