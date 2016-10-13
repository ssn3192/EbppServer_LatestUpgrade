'use strict';

app.controller('guestAccountController',
    function guestAccountController($window, $location, $scope, localStorageService, common, toaster) {

        var vm = this;

        vm.achUser = 'wfs01';

        localStorageService.set('achUser', vm.achUser);

        vm.proceed = proceed;

        vm.model = {
            //accountNumber: 'acb231'
        };

        common.configErrorHandling($scope, vm);

       //FUNCTIONS--

        function proceed() {
            if (vm.acceptTerms) {
                $location.path('guest/' + vm.accountNumber);
            }
            else {

                toaster.pop({
                    type: 'error',
                    title: 'Register',
                    body: 'You must accept the terms',
                    showCloseButton: true
                });
            }
        };
    });