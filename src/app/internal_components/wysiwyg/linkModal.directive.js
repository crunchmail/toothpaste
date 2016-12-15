/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmLinkModal
 * @restrict E
 * @requires _factory.factory:uploadStore
 * @requires _factory.factory:cmNotify
 * @requires gettextCatalog
 * @requires Lodash
 * @description
 * Upload a image on drop event
 * @scope
 * @param {Object} el Passing element
 * @param {Boolean} isButton Check if it's a button
 * @param {Function} onSuccess Promise success function
 * @param {Function} callbackFct The callback function
 */
(function () {
    'use strict';
    var directive = function(_, $log, wysService, $timeout, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                "el": "=",
                "onSuccess": "&",
                "isButton": "=",
                "callbackFct": "&"
            },
            templateUrl: "views/wysiwyg/linkModal.html",
            link: function(scope, element, attr) {
                scope.form = {};
                scope.form.href = "http://";
                scope.selectLink = "url";
                scope.showForm = "url";
                var el = scope.el;
                var mailToRegExp = /mailto:/g;
                function initVal(elmt) {
                    var href = elmt.attr('href');
                    if(mailToRegExp.test(href)) {
                        scope.selectLink = "address";
                        scope.showForm = "address";
                        href = href.split(mailToRegExp);
                        scope.form.mail = href[1];
                    }else {
                        scope.selectLink = "url";
                        scope.showForm = "url";
                        scope.form.href = href;
                    }
                }
                if(angular.element(el).find("a").length > 0) {
                    initVal(angular.element(el).find("a"));
                }
                if (!_.isUndefined(angular.element(el).attr('href'))) {
                    initVal(angular.element(el));
                }
                var savedSelection = wysService.savedSelection;
                /**
                 * @ndoc function
                 * @methodOf wysiwyg.directive:cmLinkModal
                 * @name createLink
                 * @description
                 * Create a link
                 */
                scope.createLink = function() {

                    if(scope.isButton) {
                        if(scope.selectLink === "url") {
                            angular.element(el).find("a").attr("href", scope.form.href);
                        }
                        else if(scope.selectLink === "address") {
                            angular.element(el).find("a").attr("href", "mailto:" + scope.form.mail);
                        }
                    }
                    else if (!_.isUndefined(angular.element(el).attr('href'))) {
                        if(scope.selectLink === "url") {
                            angular.element(el).attr("href", scope.form.href);
                        }
                        else if(scope.selectLink === "address") {
                            angular.element(el).attr('href', "mailto:" + scope.form.mail);
                        }
                    }
                    else {
                        wysService.restoreSelection(el, savedSelection);
                        if(scope.selectLink === "url") {
                            document.execCommand("CreateLink", false, scope.form.href);
                        }
                        else if(scope.selectLink === "address") {
                            document.execCommand("CreateLink", false, "mailto:" + scope.form.mail);
                        }
                    }
                    scope.callbackFct();
                    scope.onSuccess();
                };

                /**
                 * @ndoc function
                 * @methodOf wysiwyg.directive:cmLinkModal
                 * @name changeMe
                 * @description
                 * Change mail and link
                 */
                scope.changeMe = function() {
                    scope.showForm = scope.selectLink;
                };

                $rootScope.$on('$locationChangeStart', function(event, next) {
                    scope.onSuccess();
                });
            }
        };
    };
    module.exports = directive;
}());
