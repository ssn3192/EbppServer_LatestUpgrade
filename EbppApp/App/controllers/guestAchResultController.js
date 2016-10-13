'use strict';

app.controller('guestAchResultController', function ($routeParams) {
    var vm = this;

    vm.model = {
        confirmationNumber: $routeParams.confirmationNumber
    }
});