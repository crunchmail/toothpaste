module.exports = angular.module('toothpaste.factory', [])

/*
 * Commons
 */
.factory('apiUrl', require('_factory/apiUrl.factory'))
.factory('messageStats', require('_factory/messageStats.factory'))
.factory('cmNotify', require('_factory/cmNotify.factory'))
.factory('sessionStorageService', require('_factory/sessionStorage.factory'))
.factory('postMessageHandler', require('_factory/postMessageHandler.factory'))
.factory('tokenHandler', require('_factory/tokenHandler.factory'))
.factory('base64', require('_factory/base64.factory'))
.factory('zimletHandler', require('_factory/zimletHandler.factory'))
.factory('globalFunction', require('_factory/globalFunction.factory'))

/*
 * Specific Toothpaste
 */
.factory('uploadStore', require('internal_components/_factory/uploadStore.factory'))
.factory('actionStack', require('internal_components/_factory/actionStack.factory'));
