/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmColorModal
 * @restrict E
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires wysiwyg.factory:wysService
 * @scope
 * @param {Object} el Passing element
 * @param {Function} onSuccess Promise success function
 * @param {Object} color Passing color
 * @param {Function} callbackFct The callback function
 * @description
 * Color modal, to change text color
 */
(function () {
    'use strict';
    var directive = function(wysService, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                "el": "=",
                "onSuccess": "&",
                "color": "=",
                "callbackFct": "&"
            },
            templateUrl: "views/wysiwyg/colorModal.html",
            link: function(scope, element, attr) {
                var savedSelection = wysService.savedSelection;
                var el = scope.el;
                scope.setColors = $rootScope.originalColors;
                var rgbObjcolor = wysService.getRgbColor(scope.color);
                var colorText = 'rgb(' + rgbObjcolor.r + ', ' + rgbObjcolor.g + ', ' + rgbObjcolor.b + ')';
                scope.colorText = colorText;

                /**
                 * @ngdoc function
                 * @name changeColor
                 * @methodOf wysiwyg.directive:cmColorModal
                 * @param {Object} color color object
                 * @description
                 * Change text color
                 */
                scope.changeColor = function(color) {
                    scope.colorText = color;
                };

                /**
                 * @ngdoc function
                 * @name applyColor
                 * @methodOf wysiwyg.directive:cmColorModal
                 * @description
                 * Apply the color on element and launch callback function and dialog success promise
                 */
                scope.applyColor = function() {

                    wysService.restoreSelection(el, savedSelection);
                    document.execCommand("foreColor", false, scope.colorText);

                    scope.callbackFct();
                    scope.onSuccess();
                };

                $rootScope.$on('$locationChangeStart', function(event, next) {
                    scope.onSuccess();
                });
            }
        };
    };
    module.exports = directive;
}());
