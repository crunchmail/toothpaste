/**
 * @ngdoc service
 * @name tpl_store.factory:apiTplStore
 * @restrict E
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires https://docs.angularjs.org/api/ng/service/$http
 * @description
 * Shortcut to API template store
 */
(function () {
    'use strict';

    var factory = function($http, $rootScope) {
        return {
            /**
             * @ngdoc function
             * @name getAllTpl
             * @methodOf tpl_store.factory:apiTplStore
             * @param {Object} config Passing $http config
             * @description
             * Get all template
             */
            getAllTpl: function(config) {
                return $http.get($rootScope.tplStore+'documents/', config).then(function(result) {
                    return result.data.results;
                });
            },
            /**
             * @ngdoc function
             * @name getTpl
             * @methodOf tpl_store.factory:apiTplStore
             * @param {Number} id Passing message id
             * @description
             * Get the template associate with message id
             */
            getTpl: function(id) {
                return $http.get($rootScope.tplStore+'documents/', {
                    params: {
                        "message": id
                    }
                }).then(function(result) {
                    return result.data.results;
                });
            },
            /**
             * @ngdoc function
             * @name delete
             * @methodOf tpl_store.factory:apiTplStore
             * @param {String} url Passing API url
             * @param {Object} config Passing $http config
             * @description
             * Delete a template
             */
            delete: function(url, config) {
                return $http.delete(url, config);
            },
            /**
             * @ngdoc function
             * @name config
             * @methodOf tpl_store.factory:apiTplStore
             * @param {Object} config Passing $http config
             * @description
             * Get drafts
             */
            getDrafts: function(config) {
                return $http.get($rootScope.tplStore+'documents/?drafts', config);
            },
            /**
             * @ngdoc function
             * @name getOne
             * @methodOf tpl_store.factory:apiTplStore
             * @param {String} url Passing API url
             * @param {Object} config Passing $http config
             * @description
             * Get one template
             */
            getOne: function(url, config) {
                $rootScope.spinner.opaque = true;
                return $http.get(url, config);
            },
            /**
             * @ngdoc function
             * @name updateTpl
             * @methodOf tpl_store.factory:apiTplStore
             * @param {String} url Passing API url
             * @param {Object} tpl Passing template object
             * @description
             * Update a template
             */
            updateTpl: function(url, tpl) {
                return $http.patch(url, tpl);
            },
            /**
             * @ngdoc function
             * @name createTpl
             * @methodOf tpl_store.factory:apiTplStore
             * @param {Object} tpl Passing template object
             * @description
             * Create a new document template
             */
            createTpl: function(tpl) {
                return $http.post($rootScope.tplStore+'documents/', tpl);
            },
            /**
             * @ngdoc function
             * @name getAllBlocks
             * @methodOf tpl_store.factory:apiTplStore
             * @param {Object} config Passing $http config
             * @description
             * Get all blocks
             */
            getAllBlocks: function(config) {
                return $http.get($rootScope.tplStore+'blocks/', config);
            },
            /**
             * @ngdoc function
             * @name createBlock
             * @methodOf tpl_store.factory:apiTplStore
             * @param {Object} obj Passing block object
             * @description
             * Create a block
             */
            createBlock: function(obj) {
                return $http.post($rootScope.tplStore+'blocks/', obj);
            },
            /**
             * @ngdoc function
             * @name getStyleSets
             * @methodOf tpl_store.factory:apiTplStore
             * @param {Object} config Passing $http config
             * @description
             * Get all style sets
             */
            getStyleSets: function(config) {
                return $http.get($rootScope.tplStore+'stylesets/', config);
            },
            /**
             * @ngdoc function
             * @name getColorsSets
             * @methodOf tpl_store.factory:apiTplStore
             * @param {Object} config Passing $http config
             * @description
             * Get all colors sets
             */
            getColorsSets: function(config) {
                return $http.get($rootScope.tplStore+'colorsets/', config);
            },
            /**
             * @ngdoc function
             * @name saveColorSet
             * @methodOf tpl_store.factory:apiTplStore
             * @param {Object} obj Passing color set object
             * @description
             * Get all colors sets
             */
            saveColorSet: function(obj) {
                return $http.post($rootScope.tplStore+'colorsets/', obj);
            },
            /**
             * @ngdoc function
             * @name deleteColorSet
             * @methodOf tpl_store.factory:apiTplStore
             * @param {String} url API url
             * @description
             * Delete a color set
             */
            deleteColorSet: function(url) {
                return $http.delete(url);
            },
            /**
             * @ngdoc function
             * @name updateColorSet
             * @methodOf tpl_store.factory:apiTplStore
             * @param {String} url API url
             * @param {Object} obj Passing color set object to update
             * @description
             * Delete a color set
             */
            updateColorSet: function(url, obj) {
                return $http.patch(url, obj);
            }
        };
    };

    module.exports = factory;
}());
