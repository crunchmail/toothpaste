/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmWysiwygFooter
 * @restrict E
 * @description
 * Directive to edit footer component
 * @scope
 * @param {Object} el element
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires https://docs.angularjs.org/api/ng/service/$timeout
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires _factory.factory:globalFunction
 * @requires gettextCatalog
 * @requires Lodash
 */
(function () {
    'use strict';
    var directive = function(_, $log, $rootScope, wysService, globalFunction, gettextCatalog, $timeout) {
        return {
            templateUrl: "views/wysiwyg/wysiwygFooter.html",
            scope: {
                "el": "="
            },
            controller: function($scope) {

                $timeout(function() {
                    var style = window.getComputedStyle($scope.el.element);
                    var link = angular.element($scope.el.element).find("a");
                    var linkStyle = window.getComputedStyle(link[0]);

                    if(style.backgroundColor === "rgba(0, 0, 0, 0)") {
                        var rootEl = document.querySelector(".crunchGlobalWrapper");
                        $log.debug("rootEl");
                        $log.debug(rootEl);
                        style = window.getComputedStyle(rootEl);
                    }
                    var linkRgbColor = wysService.getRgbColor(linkStyle.color);
                    var linkRgbToHex = globalFunction.rgbToHex(linkRgbColor.r, linkRgbColor.g, linkRgbColor.b);
                    var textRgbColor = wysService.getRgbColor(style.color);
                    var textRgbToHex = globalFunction.rgbToHex(textRgbColor.r, textRgbColor.g, textRgbColor.b);
                    var rgbColor = wysService.getRgbColor(style.backgroundColor);
                    var rgbToHex = globalFunction.rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);

                    $scope.footerBgColor = rgbToHex;

                    $scope.footerLinkColor = linkRgbToHex;

                    $scope.footerColor = textRgbToHex;

                    $scope.textBgColor = gettextCatalog.getString('Background color');

                    $scope.textLinkColor = gettextCatalog.getString('Text link color');

                    $scope.textColor = gettextCatalog.getString('Text color');
                }, 3000);
            },
            link: function(scope, element, attrs) {
                var footer = document.querySelector(".messageFooter");
                var footerLink = document.querySelector(".messageFooter a");

                scope.itemTooth = {
                    "html": ""
                };

                $rootScope.$watch("footer", function(n, o){
                    var footerLogoEl = document.querySelector("#footerLogoSrc cm-wysiwyg");
                    if(!_.isNull(footerLogoEl)) {
                        $rootScope.footer.footerLogoHtml.html = footerLogoEl.innerHTML;
                    }
                }, true);

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygFooter
                 * @name addCustomLink
                 * @description
                 * Add custom link
                 */
                scope.addCustomLink = function() {
                    scope.initText = "Link";
                    $rootScope.footer.footerLinkCustomHtml.push({
                        "element": "<span><a href=\"\">" + scope.initText + "</a></span>"
                    });
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygFooter
                 * @name textForm
                 * @param {Object} form Passing form object
                 * @description
                 * Get text form
                 */
                scope.textForm = function(form) {
                    var regexp = /">(.*)<\/a>/;
                    var getText = form.element.match(regexp);
                    return getText[1];
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygFooter
                 * @name linkForm
                 * @param {Object} form Passing form object
                 * @description
                 * Get link form
                 */
                scope.linkForm = function(form) {
                    var regexp = /href="(.*)"/;
                    var getLink = form.element.match(regexp);
                    return getLink[1];
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygFooter
                 * @name addCustomFooterLink
                 * @param {String} html Passing html
                 * @param {Number} idx Array index
                 * @description
                 * Add a custom link
                 */
                scope.addCustomFooterLink = function(html, idx) {
                    $rootScope.footer.footerLinkCustomHtml[idx] = html.html;
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygFooter
                 * @name changeBgColor
                 * @param {Event} e DOM event
                 * @param {String} color Passing color
                 * @description
                 * Change background color
                 */
                scope.changeBgColor = function(e, color) {
                    footer.style.backgroundColor = color;
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygFooter
                 * @name changeTextLinkColor
                 * @param {Event} e DOM event
                 * @param {String} color Passing color
                 * @description
                 * Change link text color
                 */
                scope.changeTextLinkColor = function(e, color) {
                    footerLink.style.color = color;
                };

                /**
                 * @ngdoc function
                 * @methodOf wysiwyg.directive:cmWysiwygFooter
                 * @name changeTextColor
                 * @param {Event} e DOM event
                 * @param {String} color Passing color
                 * @description
                 * Change text color
                 */
                scope.changeTextColor = function(e, color) {
                    footer.style.color = color;
                };
            }
        };
    };
    module.exports = directive;
}());
