/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmWysiwygButton
 * @restrict E
 * @description
 * Upload a image and modify image properties
 * @scope
 * @param {Node} el Passing element to modify
 * @param {Object} config Passing element config
 * @param {Function} callback Callback function
 */
(function () {
    'use strict';
    var directive = function(_, $log, $timeout, gettextCatalog, uploadStore, cmNotify) {
        return {
            templateUrl: "views/wysiwyg/wysiwygButton.html",
            scope: {
                "el": "=",
                "config": "=",
                "callback": "&"
            },
            link: function(scope, element, attrs) {
                /**
                 * @ngdoc property
                 * @propertyOf wysiwyg.directive:cmWysiwygButton
                 * @name protocols
                 * @description
                 * Init all protocols
                 */
                scope.protocols = [{
                    value: "http://",
                    text: "http://"
                }, {
                    value: "https://",
                    text: "https://"
                }];
            /*
            , {
                value: "files",
                text: gettextCatalog.getString("Files")
            }
            */
                /**
                 * @ngdoc property
                 * @propertyOf wysiwyg.directive:cmWysiwygButton
                 * @name button
                 * @description
                 * Init scope button
                 */
                scope.button = {
                    text: angular.element(scope.el.element).find("a").text(),
                    link: angular.element(scope.el.element).find("a").attr("href")
                };

                /**
                 * Init a watch to listen change scope.config init in wysiwyg.directive.js
                 */
                scope.$watch("config", function(n, o) {
                    if(!_.isUndefined(n)) {
                        scope.button.bgColor = n.background;
                        scope.button.textColor = n.color;
                    }
                });

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygButton
                 * @name changeText
                 * @description
                 * Function to change size text
                 */
                scope.changeText = function() {
                    angular.element(scope.el.element).find("a").text(scope.button.text);
                    scope.callback({ "html" : scope.el.element.outerHTML });
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygButton
                 * @name changeLink
                 * @description
                 * Function to change link
                 */
                scope.changeLink = function() {
                    angular.element(scope.el.element).find("a").attr("href", scope.button.protocol.value + scope.button.link);
                    scope.callback({ "html" : scope.el.element.outerHTML });
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygButton
                 * @name changeBgColorButton
                 * @description
                 * Function to change button background-color and button border-color
                 */
                scope.changeBgColorButton = function() {
                    angular.element(scope.el.element).css({
                        "background": scope.button.bgColor
                    });

                    angular.element(scope.el.element).find("a").css({
                        "border-color": scope.button.bgColor
                    });
                    scope.callback({ "html" : scope.el.element.outerHTML });
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygButton
                 * @name changeBgColorButton
                 * @description
                 * Function to change button color
                 */
                scope.changeTextColorButton = function() {
                    angular.element(scope.el.element).find("a").css({
                        "color": scope.button.textColor
                    });
                    scope.callback({ "html" : scope.el.element.outerHTML });
                };

            }
        };
    };
    module.exports = directive;
}());
