/**
 * @ngdoc directive
 * @name importHtml.directive:cmImportHtml
 * @restrict E
 * @requires _factory.factory:globalFunction
 * @requires _factory.factory:cmNotify
 * @requires _factory.factory:postMessageHandler
 * @requires Lodash
 * @requires gettextCatalog
 * @requires appSettings
 * @requires message.factory:apiMessage
 * @scope
 * @param {Object} obj passing containers element
 * @param {Object} activateMenu Passing Boolean
 * @description
 * Import html directive
 */
(function () {
    'use strict';

    var directive = function(_, globalFunction, postMessageHandler,
                            apiMessage, cmNotify, gettextCatalog,
                            appSettings) {
        return {
            templateUrl:'views/importHtml/importHtml.html',
            controller: function($scope) {
                var iframe = document.getElementById("preview-html-pasted");
                $scope.htmlPasted = '<p><a href="UNSUBSCRIBE_URL">Se désinscrire </a>pour ne plus recevoir ces emails</p>';

                $scope.editorOptions = {
                    lineWrapping : true,
                    lineNumbers: true,
                    mode: 'htmlmixed',
                    theme: "dracula"
                };
                /**
                 * @ngdoc function
                 * @methodOf importHtml.directive:cmImportHtml
                 * @name codemirrorLoaded
                 * @description
                 * On code mirror load event
                 * @param {Object} _editor Editor object
                 */
                $scope.codemirrorLoaded = function(_editor) {
                    // Editor part
                    var _doc = _editor.getDoc();
                    _editor.focus();
                    _doc.markClean();

                    // Events
                    _editor.on("beforeChange", function(){
                        iframe.removeAttribute("style");
                    });
                    _editor.on("change", function(){
                        globalFunction.insertIframe($scope.htmlPasted, "#preview-html-pasted");
                    });
                };
                $scope.updateMode = false;
            },
            link: function(scope, element, attrs) {
                var messageSavedUrl = null;
                var messageUrl = appSettings.urlMessage;

                /**
                 * Get the html
                 */
                if(messageUrl !== "") {
                    apiMessage.getOne(messageUrl).then(function(result) {
                        if(_.has(result.data.properties, "importHtml")) {
                            scope.htmlPasted = result.data.html;
                        }
                    });
                }



                /**
                 * @ngdoc function
                 * @methodOf importHtml.directive:cmImportHtml
                 * @name saveHtml
                 * @description
                 * Save the html write, update the message
                 * @param {Boolean} close Close Toothpaste
                 */
                scope.saveHtml = function(close) {

                    var html = {
                        "html": scope.htmlPasted,
                        "properties": {
                            "importHtml": "True"
                        }
                    };
                    apiMessage.updateMessage(messageUrl, html).then(function(result) {
                        cmNotify.message(gettextCatalog.getString('Message updated'), 'success');
                        if(close) {
                            var url = {
                                "urlMessage": messageUrl
                            };
                            postMessageHandler.post(url);

                            var objClose = {
                                "close": true
                            };
                            postMessageHandler.post(objClose);


                        }
                    });
                };

                scope.updateHtml = function(close) {
                    // var objCreate = {
                    //     "update": {
                    //         "html": scope.htmlPasted
                    //     }
                    // };
                    // postMessageHandler.post(objCreate);
                    //
                    // if(close) {
                    //     var objClose = {
                    //         "close": true
                    //     };
                    //     postMessageHandler.post(objClose);
                    // }
                };
            }
        };

    };

    module.exports = directive;
}());
