'use strict';

app.factory('globalFactory', function ($q) {
    var service = {};

    var urlBase = 'http://localhost:50690/api';

    service.getUrlBase = function () {
        return urlBase;
    }

    function startsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
    }

    function endsWith(str, suffix) {
        return str.match(suffix + "$") === suffix;
    }


    return service;
});