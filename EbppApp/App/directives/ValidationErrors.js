angular.module("clickHereToPayMoney")
    .directive("validationErrors", function () {
        return {
            templateUrl: "../app/partials/validationErrors.html"
        };
    });