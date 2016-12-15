/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmWysiwygBgColor
 * @restrict E
 * @description
 * Change element background-color 
 * @scope
 * @param {Node} el Passing element to modify
 * @param {Function} callback Callback function
 */
(function () {
    'use strict';
    var directive = function() {
        return {
            scope: {
                "el": "=",
                "callback": "&"
            },
            templateUrl:'views/wysiwyg/wysiwygBgColor.html',
            link: function(scope, element, attrs) {
                scope.bgColor = scope.el.initVal;
                /**
                 * @ngdoc property
                 * @name changeBgColor
                 * @propertyOf wysiwyg.directive:cmWysiwygBgColor
                 * @description
                 * Change backgroundColor
                 */
                scope.changeBgColor = function(e, color) {
                    scope.el.element.style.backgroundColor = color;
                    scope.el.initVal = scope.bgColor;
                    scope.callback({ "html" : scope.el.element.outerHTML });
                };
            }
        };
    };
    module.exports = directive;
}());
