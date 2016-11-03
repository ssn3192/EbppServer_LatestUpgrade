'use strict';
app.factory('customerAccountItemFactory', function ($http, $q, $location, config, usSpinnerService){

    var service = {};
    var url = config.urlEbppApi;
    
    var _itemId = '';
    service.setItemId = function (itemId) {
        _itemId = itemId;
    }

    service.getItemId = function () {
        return _itemId;
    }
    


}
