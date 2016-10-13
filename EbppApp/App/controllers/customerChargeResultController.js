'use strict';

app.controller('customerChargeResultController', function ($routeParams) {
    var vm = this;

    vm.model = {
        authorizationCode: $routeParams.authorizationCode
    }

    vm.fields = [
        {
            className: 'section-label',

            template: '<div><strong>Confirmation:</strong></div><hr/>'

        },
        {
            className: 'row',
            fieldGroup: [
                {
                    key: 'authorizationCode',
                    type: 'readonly',
                    templateOptions: {
                        type: 'text',
                        label: 'Authorization'
                    }
                }
            ]
        }
    ];

});