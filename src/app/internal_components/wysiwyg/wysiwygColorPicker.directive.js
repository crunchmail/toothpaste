/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmWysiwygColorPicker
 * @restrict E
 * @scope
 * @param {Object} bgColorModel Color
 * @param {Function} changeFct Function to change element color
 * @param {Object} text Title text
 */
(function () {
    'use strict';
    var directive = function(_, $log) {
        return {
            scope: {
                "bgColorModel": "=",
                "changeFct": "&",
                "text": "="
            },
            templateUrl:'views/wysiwyg/wysiwygColorPicker.html',
            link: function(scope, element, attrs) {
                var actionStackColor = [];
                /**
                 * @ngdoc function
                 * @name changeColor
                 * @methodOf wysiwyg.directive:cmWysiwygColorPicker
                 * @param {Event} e DOM event
                 * @param {String} color Passing color
                 * @description
                 * Change Color
                 */
                scope.changeColor = function(e, color) {
                    scope.changeFct({
                        $event: e,
                        color: color
                    });
                };
                var saveOldColor = null;
                var first = false;
                scope.$watch("bgColorModel", function(n, o) {
                    if(!_.isUndefined(n) && !_.isNull(n) && !first) {
                        saveOldColor = n;
                        first = true;
                    }
                });

                /**
                 * @ngdoc function
                 * @name resetColor
                 * @methodOf wysiwyg.directive:cmWysiwygColorPicker
                 * @param {Event} e DOM event
                 * Reset change color
                 */
                scope.resetColor = function(e) {
                    scope.bgColorModel = saveOldColor;
                    scope.changeFct({
                        $event: e,
                        color: ""
                    });
                };
            }
        };
    };
    module.exports = directive;
}());
