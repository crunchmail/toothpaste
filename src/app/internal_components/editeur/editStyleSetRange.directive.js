/**
 * @ngdoc directive
 * @name editeur.directive:cmEditStyleSetRange
 * @restrict E
 * @description
 * A directive to edit style set rule with a input range
 * @requires editeur.factory:editStyleSetFactory
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @scope
 * @param {Number} minRange Min range for input range
 * @param {Number} maxRange Max range for input range
 * @param {Number} stepRange Step range for input range
 * @param {String} regexp Regexp to find style rule
 * @param {Object} initValue To init with the correct value
 */
(function () {
    'use strict';

    var directive = function($rootScope, editStyleSetFactory) {
        return {
            restrict: "E",
            scope: {
                "minRange"  : "@",
                "maxRange"  : "@",
                "stepRange" : "@",
                "regexp"    : "@",
                "initValue" : "="
            },
            require: "^cmAppEditeur",
            templateUrl: 'views/editeur/_editStyleSetRange.html',
            link: function(scope, element, attrs, ctrl) {
                var regexp;

                scope.$watch("initValue", function(n, o) {
                    scope.value = n;
                    regexp = editStyleSetFactory.createRegexp(scope.regexp, n);
                });

                /**
                 * @ngdoc function
                 * @methodOf editeur.directive:cmEditStyleSetRange
                 * @name resetValue
                 * @description
                 * Reset the value, and re-apply old value
                 */
                scope.resetValue = function() {
                    scope.value = scope.initValue;
                    scope.change();
                };

                /**
                 * @ngdoc function
                 * @methodOf editeur.directive:cmEditStyleSetRange
                 * @name resetValue
                 * @description
                 * Apply the new style
                 */
                scope.change = function() {
                    editStyleSetFactory.applyStyleSet(regexp, scope.regexp + ":" + scope.value, ctrl);

                    regexp = new RegExp(scope.regexp + ":\\s?" + scope.value, "g");
                };
            }
        };
    };

    module.exports = directive;

}());
