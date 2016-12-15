/**
 * @ngdoc directive
 * @name tpl_store.directive:cmListTpl
 * @restrict E
 * @requires tpl_store.factory:apiTplStore
 * @requires appSettings
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires https://docs.angularjs.org/api/ng/service/$location
 * @requires _factory.factory:cmNotify
 * @requires _factory.factory:base64
 * @requires gettextCatalog
 */

(function () {
    'use strict';
    var directive = function(apiTplStore, appSettings, $rootScope, $log, cmNotify, gettextCatalog, base64, $location) {
        return {
            templateUrl:'views/tpl_store/_list_tpl.html',
            controller: function($scope) {
                var vm = this;
                vm.allTpl = [];
                $scope.listPubTpls = [];
                $scope.listPrivTpls = [];
                /**
                 * Init
                 */
                $scope.tabs = {
                    active: 0
                };
                /**
                 * Get all template and order by private and public
                 */
                apiTplStore.getAllTpl({
                    params: {
                        "is_template": "True"
                    }
                }).then(function(result) {
                    for(var t in result) {
                        if(typeof result[t] === "object") {
                            if(result[t].is_public) {
                                $scope.listPubTpls.push(result[t]);
                            }else {
                                $scope.listPrivTpls.push(result[t]);
                            }
                        }
                    }
                });

                /**
                 * @ngdoc function
                 * @name deleteTpl
                 * @methodOf tpl_store.directive:cmListTpl
                 * @param {String} url document url to delete
                 * @param {Number} idx array index of listing templates to delete it
                 * @description Delete a private template
                 */
                $scope.deleteTpl = function(url, idx) {
                    apiTplStore.delete(url).then(function() {
                        cmNotify.message(gettextCatalog.getString('Your template has been deleted'), 'success');
                        $scope.listPrivTpls.splice(idx, 1);
                    });
                };

                /**
                 * @ngdoc function
                 * @name showPreview
                 * @methodOf tpl_store.directive:cmListTpl
                 * @param {Object} tpl document
                 * @description Show the preview before edition
                 */
                $scope.showPreview = function(tpl) {
                    tpl.active = !tpl.active;
                    if(tpl.active) {
                        document.body.classList.add("overflowHideBody");
                    }else {
                        document.body.classList.remove("overflowHideBody");
                    }
                };

                /**
                 * @ngdoc function
                 * @name returnApp
                 * @methodOf tpl_store.directive:cmListTpl
                 * @description return to iframe integration
                 */
                $scope.returnApp = function() {
                    var objToSend = {
                        "close": true
                    };
                    postMessageHandler.post(objToSend);

                    var url = {
                        "urlMessage": appSettings.messageUrl
                    };
                    postMessageHandler.post(url);
                };

                /**
                 * @ngdoc function
                 * @name returnEdition
                 * @methodOf tpl_store.directive:cmListTpl
                 * @description return to edition
                 */
                $scope.returnEdition = function() {
                    //$log.debug($rootScope.urlDocSaved);
                    $location.path('/editeur/' + base64.encode($rootScope.urlDocSaved));
                };
            }
        };
    };

    module.exports = directive;
}());
