'user strict';

app.controller('logoutController', function (loginFactory) {
    var vm = this;

    vm.model = {
        test: 123
    }

    loginFactory.logout();
})