module.exports = angular.module('appConfig', [])

.constant("appSettings", require('./constant'))
// expose libraries
.constant('_', require('lodash'))
.constant('moment', require('moment'))
.factory("authInterceptor", require('_factory/authInterceptor.factory'))
.config(function($logProvider, appSettings) {
    if(appSettings.debug) {
        $logProvider.debugEnabled(true);
    }else {
        $logProvider.debugEnabled(false);
    }
})
.config(require('./apiConfig'));
