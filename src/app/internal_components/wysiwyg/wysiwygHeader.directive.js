/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmWysiwygHeader
 * @restrict E
 * @description
 * Directive to edit header component
 * @scope
 * @param {Object} el element
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires _factory.factory:globalFunction
 * @requires editeur.factory:editeurService
 * @requires gettextCatalog
 * @requires Lodash
 */
(function () {
    'use strict';
    var directive = function(_, $log, $rootScope, editeurService, wysService, globalFunction, gettextCatalog, $timeout) {
        return {
            scope: {
                "el": "=",
                "toolbarId": "@"
            },
            templateUrl: "views/wysiwyg/wysiwygHeader.html",
            controller: function($scope) {
                $timeout(function() {
                    var style = window.getComputedStyle($scope.el.element);
                    var link = angular.element($scope.el.element).find("a");
                    var linkStyle = window.getComputedStyle(link[0]);

                    if(style.backgroundColor === "rgba(0, 0, 0, 0)") {
                        var rootEl = document.querySelector(".crunchGlobalWrapper");
                        style = window.getComputedStyle(rootEl);
                    }
                    var linkRgbColor = wysService.getRgbColor(linkStyle.color);
                    var linkRgbToHex = globalFunction.rgbToHex(linkRgbColor.r, linkRgbColor.g, linkRgbColor.b);
                    var textRgbColor = wysService.getRgbColor(style.color);
                    var textRgbToHex = globalFunction.rgbToHex(textRgbColor.r, textRgbColor.g, textRgbColor.b);
                    var rgbColor = wysService.getRgbColor(style.backgroundColor);
                    var rgbToHex = globalFunction.rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);

                    $scope.headerBgColor = rgbToHex;

                    $scope.headerLinkColor = linkRgbToHex;

                    $scope.headerColor = textRgbToHex;

                    $scope.textBgColor = gettextCatalog.getString('Background color');

                    $scope.textLinkColor = gettextCatalog.getString('Text link color');

                    $scope.textColor = gettextCatalog.getString('Text color');
                }, 3000);
            },
            link: function(scope, element, attrs) {
                var header = document.querySelector(".messageHeader");
                var headerLink = document.querySelector(".messageHeader a");
                $rootScope.$watch("header", function(n, o){
                    editeurService.header = n;
                }, true);

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygHeader
                 * @name hideHeaderToolbar
                 * @description
                 * Hide Header edition
                 */
                scope.hideHeaderToolbar = function() {
                    document.getElementById(scope.toolbarId).classList.remove("active");
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygHeader
                 * @name changeBgColor
                 * @param {Event} e DOM event
                 * @param {String} color Passing color
                 * @description
                 * Change background color
                 */
                scope.changeBgColor = function(e, color) {
                    header.style.backgroundColor = color;
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygHeader
                 * @name changeTextLinkColor
                 * @param {Event} e DOM event
                 * @param {String} color Passing color
                 * @description
                 * Change text link color
                 */
                scope.changeTextLinkColor = function(e, color) {
                    headerLink.style.color = color;
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygHeader
                 * @name changeTextColor
                 * @param {Event} e DOM event
                 * @param {String} color Passing color
                 * @description
                 * Change text color
                 */
                scope.changeTextColor = function(e, color) {
                    header.style.color = color;
                };
            }
        };
    };
    module.exports = directive;
}());
