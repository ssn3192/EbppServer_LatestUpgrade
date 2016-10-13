(function () {
    'use strict';

    var currentUrl = window.location.href;

    var localDev = false;

    var localDevIndex = currentUrl.toLowerCase().indexOf('localhost');

    if (localDevIndex > -1) {
        localDev = true;
    }

    var apiUrl = localDev ? 'http://localhost:10073/' : 'http://achworldpayidentitywebapi.azurewebsites.net/';
    var idsrvUrl = localDev ? 'https://localhost:44333/core/' : 'https://achworldpayidentitywebhost.azurewebsites.net/core/';

    var api = {
        account: apiUrl + 'api/user/',
        connect: idsrvUrl + 'connect/token'
    };


    var config = {
        appErrorPrefix: '[ABS Error] ', //Configure the exceptionHandler decorator
        docTitle: 'Identity',
        apiUrl: apiUrl,
        api: api,
        version: '0.1'
    };

    app.value('config', config);

    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);

    app.config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('clickHere');
    }
    );

    var urlEbppApiDynamic = localDev ? 'http://localhost:59432/api' : 'http://ebpp-restapi.azurewebsites.net/api';
    //var urlAchApiDynamic = localDev ? 'http://localhost:62004/api' : 'http://achnachastagerestapi.azurewebsites.net/api';

    app.constant('config', {
        urlEbppApi: urlEbppApiDynamic,
        //urlAchApi: urlAchApiDynamic,
        urlMerchantReturn: 'http://localhost:64177',
        api: {
            account: apiUrl + 'api/user/',
            connect: idsrvUrl + 'connect/token'
        },
        secureNetPublicKey: '0b9bf5e0-63e3-4d7f-bf0f-2ac79ef603f6',
        developerApplication: { developerId: 10000640, version: '1.2' },
        merchantGuid: '6EADE888-BC44-4109-85A6-979D0E0E3248'
    });
})();