/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmWysiwygLink
 * @restrict E
 * @description directive of button wysiwyg
 * @scope
 * @param {Object} initText init the button text value
 * @param {Object} initLink init the button link value
 * @param {Object} el passing the element
 * @param {Function} callback passing a callback function
 */
(function () {
    'use strict';
    var directive = function(_, $log, globalFunction, gettextCatalog, uploadStore, cmNotify) {
        return {
            scope: {
                "initText": "=",
                "initLink": "=",
                "callback": "&",
                "el": "="
            },
            require: '^cmAppEditeur',
            templateUrl: "views/wysiwyg/wysiwygLink.html",
            link: function(scope, element, attrs, ctrl) {
                scope.protocols = [{
                    value: "http://",
                    text: "http://"
                }, {
                    value: "https://",
                    text: "https://"
                }, {
                    value: "mailto:",
                    text: "Mail"
                }, {
                    value: "files",
                    text: gettextCatalog.getString("Files")
                }];

                scope.id = globalFunction.generateUUID();
                /*
                , {
                    value: "files",
                    text: gettextCatalog.getString("Files")
                }
                */
                var protocolRegexp = /^(http(s)?:\/\/)|(mailto:)*(.*)/g;

                /**
                 * Init
                 */
                scope.init = {
                    link: "",
                    protocol: "http://"
                };
                scope.$watch("initLink", function(n, o) {
                    if(!_.isUndefined(n) && n !== "") {
                        var split = n.match(protocolRegexp);
                        scope.init.link = split[1];
                        scope.init.protocol = split[0];
                    }
                });

                /**
                 * @ngdoc function
                 * @name changeText
                 * @methodOf wysiwyg.directive:cmWysiwygLink
                 * @description to change size text
                 */
                scope.changeText = function() {

                    if(typeof scope.el.element === "string") {
                        var regexp = /">.*<\/a>/g;
                        scope.el.element = scope.el.element.replace(regexp, "\">" + scope.initText + "</a>");
                    }else {
                        angular.element(scope.el.element).find("a").text(scope.initText);
                    }
                    scope.callback({
                        "html": {
                            "html" : angular.element(scope.el.element)[0].outerHTML
                        }
                    });
                };

                /**
                 * @ngdoc function
                 * @name changeLink
                 * @methodOf wysiwyg.directive:cmWysiwygLink
                 * @description to change link
                 */
                scope.changeLink = function() {
                    if(typeof scope.el.element === "string") {
                        var regexp = /href=".*"/g;
                        scope.el.element = scope.el.element.replace(regexp, "href=\"" + scope.init.protocol + scope.init.link + "\"");
                    }else {
                        angular.element(scope.el.element).find("a").attr("href", scope.init.protocol + scope.init.link);
                    }
                    scope.callback({
                        "html": {
                            "html" : angular.element(scope.el.element)[0].outerHTML
                        }
                    });
                };

                /**
                 * @ngdoc function
                 * @name changeMail
                 * @methodOf wysiwyg.directive:cmWysiwygLink
                 * @description to change mail
                 */
                scope.changeMail = function() {
                    if(typeof scope.el.element === "string") {
                        var regexp = /href=".*"/g;
                        scope.el.element = scope.el.element.replace(regexp, "href=\"" + scope.init.protocol + scope.init.link + "\"");
                    }else {
                        angular.element(scope.el.element).find("a").attr("href", scope.init.protocol + scope.init.link);
                    }
                    scope.callback({
                        "html": {
                            "html" : angular.element(scope.el.element)[0].outerHTML
                        }
                    });
                };

                /**
                 * @ngdoc function
                 * @name changeProtocol
                 * @methodOf wysiwyg.directive:cmWysiwygLink
                 * @description to change link
                 */
                scope.changeProtocol = function() {
                    if(scope.init.protocol !== "files") {
                        if(typeof scope.el.element === "string") {
                            var regexp = /href=".*"/g;
                            scope.el.element = scope.el.element.replace(regexp, "href=\"" + scope.init.protocol + scope.init.link + "\"");
                        }else {
                            angular.element(scope.el.element).find("a").attr("href", scope.init.protocol + scope.init.link);
                        }
                    }
                    scope.callback({
                        "html": {
                            "html" : angular.element(scope.el.element)[0].outerHTML
                        }
                    });
                };

                /**
                 * @ngdoc function
                 * @name changeProtocol
                 * @methodOf wysiwyg.directive:cmWysiwygLink
                 * @description
                 * Function to upload a file
                 */
                scope.uploadFile = function(file) {
                    uploadStore.postFile(file, ctrl.documentModel.url, "image").then(function(data) {
                        angular.element(scope.el.element).find("a").attr("href", data.file);
                        scope.callback({
                            "html": {
                                "html" : angular.element(scope.el.element)[0].outerHTML
                            }
                        });
                        cmNotify.message(gettextCatalog.getString('File added'), 'success');
                    }, function() {
                        cmNotify.message(gettextCatalog.getString('Your file haven\'t been added'), 'error');
                    });
                };
            }
        };
    };
    module.exports = directive;
}());
