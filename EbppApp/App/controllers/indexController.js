'use strict';

app.controller('indexController', function (
    $scope,
    $routeParams,
    $location,
    merchantFactory,
    indexFactory) {

    var vm = this;
    vm.isLoggedIn = false;
    vm.merchantId = 1;
    //atlanta: 6EADE888-BC44-4109-85A6-979D0E0E3248 KUS9P5N5E624
    //groupEz: d9746a70-810f-4d5c-bb6c-3cce5c60c245 PS47NUJK34Y6

    //TODO: unhardcode this
    //var merchantGuid = $location.$$path.split('/')[2] === undefined ? '6EADE888-BC44-4109-85A6-979D0E0E3248' : $location.$$path.split('/')[2];
    //var apiKey = $location.$$path.split('/')[3] === undefined ? 'KUS9P5N5E624' : $location.$$path.split('/')[3];

    //var merchantCredential = {
    //    merchantId: merchantGuid,
    //    merchantApiKey: apiKey
    //};

    //indexFactory.validateMerchant(merchantCredential).then(
    //    function(validateMerchantResponse) {
    //        //success
    //        var data = validateMerchantResponse.data;
    //    },
    //    function (validateMerchantResponse) {
    //        //failure
    //        //$location.path('insufficient');
    //    });


    var logoUrl = '';

    merchantFactory.getMerchant(vm.merchantId).then(
        function (getMerchantResponse) {
            logoUrl = getMerchantResponse.data.logoUrl;
            vm.logo = logoUrl;
        },
        function (getMerchantResponse) {
            var f = getMerchantResponse;
        }
    );


})