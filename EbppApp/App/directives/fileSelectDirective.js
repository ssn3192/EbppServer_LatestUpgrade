'use strict';
console.log(app);
app.directive('fileSelect', [
    '$window', 'localStorageService',
    function ($window, localStorageService) {
        return {
            restrict: 'A',
            require: ['ngModel'],
            link: function (scope, el, attr, ctrl) {
                var fileType = attr['fileSelect'];

                var fileInput = document.getElementById('fileInput');

                fileInput.addEventListener('change', function (e) {
                    var file = fileInput.files[0];
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        var r = reader.result;
                        localStorageService.set('fileSelect', r);

                    }

                    reader.readAsText(file);
                });
            }
        };
    }
]);