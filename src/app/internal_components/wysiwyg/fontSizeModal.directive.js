/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmFontSizeModal
 * @restrict E
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires wysiwyg.factory:wysService
 * @scope
 * @param {Object} el Passing element
 * @param {Function} onSuccess Promise success function
 * @param {Function} callbackFct The callback function
 * @description
 * Font size modal to change the propertuy font-size on an element
 */
(function () {
    'use strict';
    var directive = function() {
        return {
            restrict: 'E',
            scope: {
                "el": "=",
                "onSuccess": "&",
                "callbackFct": "&"
            },
            templateUrl: "views/wysiwyg/fontSizeModal.html",
            link: function(scope, element, attr) {
                var initVal = getComputedStyle(scope.el.children[0]).fontSize.split("px");
                scope.fontSizeValue = parseInt(initVal);

                scope.applyFontSize = function() {
                    scope.el.children[0].style.fontSize = scope.fontSizeValue + 'px';
                    scope.callbackFct();
                };
            }
        };
    };
    module.exports = directive;
}());
