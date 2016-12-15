(function () {
    'use strict';

    var apiConfig = function (appSettings, $httpProvider){

        $httpProvider.interceptors.push('authInterceptor');
    };

    module.exports = apiConfig;
}());
