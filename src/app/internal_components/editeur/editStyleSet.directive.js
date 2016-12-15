/**
 * @ngdoc directive
 * @name editeur.directive:cmEditStyleSet
 * @restrict E
 * @description
 * Edit a styleset
 * @scope
 * @param {Object} cmStyleTpl Passing API style set
 * @param {Object} cmInitValues Passing less variables
 */
(function () {
    'use strict';

    var directive = function($log, _, editeurService, $timeout, $rootScope,
                            editStyleSetFactory, styleSetFct, $compile) {
        return {
            restrict: "E",
            templateUrl: 'views/editeur/_editStyleSet.html',
            scope: {
                'cmStyleTpl': "=",
                'cmInitValues': "="
            },
            require: "^cmAppEditeur",
            link: function(scope, element, attrs, ctrl) {
                var regexp;
                /*
                 * Passing init Values to directives components
                 */
                scope.$watch('cmInitValues', function(newValue, oldValue) {
                    if(!_.isUndefined(newValue)) {
                        scope.initVarLess = newValue;
                        /*
                         * Create regexp to catch align value
                         */
                        regexp = editStyleSetFactory.createRegexp("@align_block", newValue["@align_block"]);
                        scope.isActiveVAlign = newValue["@align_block"];
                    }
                });

                /*
                 * get objects array from stylSetFct apply function
                 */
                scope.$watch('cmStyleTpl', function(newValue, oldValue) {
                    if(!_.isUndefined(newValue)) {

                        scope.rangeTplStyle = newValue;
                    }
                });
                /**
                 * @scope property
                 * @propertyOf editeur.directive:cmEditStyleSet
                 * @name fontFamily
                 * @description
                 * Load font family
                 */
                scope.fontFamily = editeurService.fontFamily;

                /**
                 * @scope function
                 * @methodOf editeur.directive:cmEditStyleSet
                 * @name verticalAlign
                 * @description
                 * Change global vertical align on template
                 * @param {String} pos Passing old align_block position
                 * @param {Event} e Passing DOM event 
                 */
                scope.verticalAlign = function(e, pos) {
                    scope.isActiveVAlign = pos;
                    editStyleSetFactory.applyStyleSet(regexp, "@align_block:" + pos, ctrl);

                    regexp = new RegExp("@align_block:\\s?" + pos, "g");
                };

            }
        };
    };

    module.exports = directive;

}());
