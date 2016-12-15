/**
 * @ngdoc service
 * @name _factory.factory:actionStack
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @description
 * Push action and undo an action
 */
(function () {
    'use strict';

    var factory = function($rootScope) {
        return {
            stack : [],
            /**
             * @ngdoc function
             * @name push
             * @methodOf _factory.factory:actionStack
             * @param {Function} func the function to push
             * @description
             * Push an undo function to the stack
             */
            push: function (func) {
                this.stack.push(func);
                $rootScope.showActionStack = true;
            },
            /**
             * @ngdoc function
             * @name undo
             * @methodOf _factory.factory:actionStack
             * @description
             * Calls the latest pushed function
             */
            undo: function() {
                var last_el = this.stack.pop();
                if (last_el) {
                    last_el();
                } else {

                    $log.info('nothing to undo');
                }
                if(this.stack.length === 0) {
                    $rootScope.showActionStack = false;
                }
            },
        };
    };
    module.exports = factory;
}());
