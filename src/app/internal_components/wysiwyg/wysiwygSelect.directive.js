/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmWysiwygSelect
 * @restrict E
 * @description
 * Directive to edit Font Family
 * @scope
 * @param {Object} el element
 * @param {Function} callback Callback function
 * @requires editeur.factory:editeurService
 */
(function () {
    'use strict';
    var directive = function(_, editeurService) {
        return {
            restrict: "E",
            scope: {
                "el": "=",
                "callback": "&"
            },
            templateUrl: "views/wysiwyg/wysiwygSelect.html",
            link: function(scope, element, attrs, ctrl) {
                var ff = getComputedStyle(scope.el.children[0]).fontFamily.split(",");
                var regexp = /(')[a-zA-Z\d\s]*(')/g;
                var regexpDoubleQuote = /(")[a-zA-Z\d\s]*(")/g;
                var initFF;
                /*
                 * check if it's ff with simple quote
                 */
                if(regexp.test(ff[0])) {
                    initFF = ff[0].replace(/'/g, "");
                }else {
                    initFF = ff[0];
                }
                if(regexpDoubleQuote.test(ff[0])) {
                    initFF = ff[0].replace(/"/g, "");
                }else {
                    initFF = ff[0];
                }
                scope.fontFamilyModel = initFF;
                scope.fontFamily = editeurService.fontFamily;

                /**
                 * @ngdoc function
                 * @name changeFF
                 * @methodOf wysiwyg.directive:cmWysiwygSelect
                 * @description
                 * Change Font Family and update header html
                 */
                scope.changeFF = function() {
                    scope.el.children[0].style.fontFamily = scope.fontFamilyModel;
                    scope.callback({ "html" : scope.el.element.outerHTML });
                };
            }
        };
    };
    module.exports = directive;
}());
