(function () {
    'use strict';

    var apiConfig = function (appSettings, $httpProvider, $locationProvider){
        $locationProvider.hashPrefix('');
        $httpProvider.interceptors.push('authInterceptor');
    };

    module.exports = apiConfig;
}());
