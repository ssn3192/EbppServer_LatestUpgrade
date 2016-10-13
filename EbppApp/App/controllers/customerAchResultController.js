'use strict';

app.controller('customerAchResultController', function ($routeParams) {
    var vm = this;

    vm.model = {
        confirmationNumber: $routeParams.confirmationNumber
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
                    key: 'confirmationNumber',
                    type: 'readonly',
                    templateOptions: {
                        type: 'text',
                        label: 'Confirmation Number'
                    }
                }
            ]
        }
    ];
});