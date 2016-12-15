/**
 * @ngdoc directive
 * @name editeur.directive:cmEditStyleSetSelect
 * @restrict E
 * @description
 * A directive to edit style set rule with a select
 * @requires editeur.factory:editStyleSetFactory
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @scope
 * @param {String} regexp Regexp to find style rule
 * @param {Object} selectValue Init select
 * @param {Object} initValue Init select value
 */
(function () {
    'use strict';

    var directive = function($rootScope, editStyleSetFactory) {
        return {
            restrict: "E",
            scope: {
                "regexp" : "@",
                "selectValue" : "=",
                "initValue" : "="
            },
            require: "^cmAppEditeur",
            templateUrl: 'views/editeur/_editStyleSetSelect.html',
            link: function(scope, element, attrs, ctrl) {
                var regexp;

                scope.$watch("initValue", function(n, o) {
                    scope.value = n;
                    regexp = editStyleSetFactory.createRegexp(scope.regexp, n);
                });

                /**
                 * @ngdoc function
                 * @methodOf editeur.directive:cmEditStyleSetSelect
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
                 * @methodOf editeur.directive:cmEditStyleSetSelect
                 * @name change
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
