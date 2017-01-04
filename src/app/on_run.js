(function () {
    'use strict';
    var OnRun = function($http, appSettings, $rootScope, $location,
                         wysService, $log, postMessageHandler, _,
                         editeurService, $route, apiUrl, tokenHandler, base64,
                         gettextCatalog, jwtHelper, styleSetFct,
                         apiTplStore, apiUser) {
        //postMessage iframe to parent for Zimbra
        $rootScope.debug = appSettings.debug;
        $rootScope.spinner = {};
        $rootScope.listPubTpls = [];
        $rootScope.listPrivTpls = [];

        var searchObj = $location.search();
        $log.debug("searchObj");
        $log.debug(searchObj);
        if(!_.isEmpty(searchObj)) {
            _.forOwn(searchObj, function(v, k) {
                $log.debug(k);
                if(k === "apiUrl") {
                    $log.debug("get api url : " + v);
                    apiUrl.init(v).then(function() {
                        apiUser.getProfile().then(function(result) {
                            /**
                             * Init Raven
                             */
                            window.Raven
                            .config(appSettings.raven.dsn, {
                                release: appSettings.config.release,
                                tags: {
                                    git_commit: appSettings.config.tags.git_commit,
                                    env: appSettings.config.tags.env
                                }
                            })
                            .setUserContext( {
                                email: result.data.identifier
                            })
                            .addPlugin(require('raven-js/dist/plugins/angular'), angular)
                            .install();
                        });
                    });
                    appSettings.apiUrl = v;
                }
                else if(k === "token") {
                    $log.debug("get token");
                    tokenHandler.setHeader(v);
                    /*
                     * get new Token
                     */
                    tokenHandler.getNewToken(v).then(function(data) {
                        var date = jwtHelper.getTokenExpirationDate(data.token);
                        $log.debug("getTokenExpirationDate");
                        $log.debug(date);
                        tokenHandler.refreshToken(data.token);
                    });

                }
                else if(k === "nameTpl") {
                    $log.debug("get name tpl : " + v);
                    appSettings.nameTemp = v;
                }
                else if(k === "urlMessage") {
                    $log.debug("get message url : " + v);
                    appSettings.urlMessage = v;
                    // $rootScope.$apply(function() {
                    //     $location.path('/import-html/' + v);
                    // });
                }
                else if(k === "idMessage") {
                    $log.debug("get id message : " + v);
                    apiTplStore.getTpl(v).then(function(result) {
                        $log.debug("result");
                        $log.debug(result);
                        if(result.length > 0) {
                            $log.debug(result[0].url);
                            $location.path('/editeur/' + base64.encode(result[0].url));
                        }
                    });
                }
                else if(k === "importHtml") {
                    $rootScope.$apply(function() {
                        $location.path('/import-html/');
                    });
                }
                // else {
                //     apiUrl.init(appSettings.apiUrl);
                // }
            });
        }else {
            $log.debug("empty");
            apiUrl.init(appSettings.apiUrl);
        }

        // TODO: lang from cookies?
        var lang = appSettings.lang.default ? appSettings.lang.default : 'en';

        gettextCatalog.debug = appSettings.lang.debug ? true : false;
        gettextCatalog.debugPrefix = appSettings.lang.debugPrefix;
        gettextCatalog.setCurrentLanguage(lang);
        gettextCatalog.loadRemote("./lang/" + lang + "/template.json");
        gettextCatalog.loadRemote("./lang/" + lang + "/toothpaste.json");

        /*
         * Load Toothpick Layout and typography
         * TODO remove rootScope
         */
        editeurService.getToothpickCss("global").then(function(data) {
            $rootScope.toothpickGlobal = data;
        });
        editeurService.getToothpickCss("rwd").then(function(data) {
            $rootScope.toothpickRwd = data;
        });
        editeurService.getToothpickCss("commons").then(function(data) {
            styleSetFct.toothpickCssStyle = data;
        });
        editeurService.getToothpickLess("commons").then(function(data) {
            styleSetFct.toothpickLessStyle = data;
            /*
             * Extract less variables and create array with values
             */
            var lessVariables = CSSJSON.toJSON(data).attributes;
            var arr = styleSetFct.createArrayCommonLessVariables(lessVariables);
            styleSetFct.arrayCommonLessVariables = arr;

        });
        editeurService.getToothpickLess("basic-colors").then(function(data) {
            $rootScope.globalStyle = data;
        });

        /*
         * Init postMessage
         */
        postMessageHandler.init();

        $rootScope.$on('$routeChangeSuccess', function(event, toState) {
            wysService.destroy();
            /*
            * see route.js to classes on body
            */
            $rootScope.bodyClass = $route.current.$$route.bodyClass;
        });

    };

    module.exports = OnRun;

}());
