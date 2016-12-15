/**
 * @ngdoc directive
 * @name editeur.directive:cmAppEditeur
 * @restrict E
 * @requires https://docs.angularjs.org/api/ng/service/$routeParams
 * @requires https://docs.angularjs.org/api/ng/service/$timeout
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires https://docs.angularjs.org/api/ng/service/$location
 * @requires https://docs.angularjs.org/api/ng/service/$document
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires https://docs.angularjs.org/api/ng/service/$q
 * @requires _factory.factory:globalFunction
 * @requires _factory.factory:base64
 * @requires _factory.factory:actionStack
 * @requires _factory.factory:postMessageHandler
 * @requires _factory.factory:cmNotify
 * @requires editeur.factory:editeurService
 * @requires editeur.factory:blockFactory
 * @requires editeur.factory:editStyleSetFactory
 * @requires tpl_store.factory:apiTplStore
 * @requires http://likeastore.github.io/ngDialog
 * @requires message.factory:apiMessage
 * @requires wysiwyg.factory:wysService
 * @requires appSettings
 * @requires Lodash
 * @requires gettextCatalog
 */
(function () {
    'use strict';

    var directive = function($routeParams, globalFunction, $timeout,
        $rootScope, apiTplStore, styleSetFct, $location,
        appSettings, $log, editeurService, actionStack,
        postMessageHandler, _, ngDialog, wysService,
        $document, cmNotify, gettextCatalog, blockFactory, base64, editStyleSetFactory,
        apiMessage, $q) {
            return {
                templateUrl:'views/editeur/_editeur.html',
                controller: function($scope) {
                    /*
                    * Init
                    */
                    $scope.blocks = [];
                    $scope.privateBlocks = [];
                    $rootScope.emptyEditor = false;
                    $rootScope.deletedElements = [];
                    $scope.enableUpdateBtnPrivTpl = false;
                    $scope.isDraft = false;
                    $scope.isPubTpl = false;
                    $scope.emptyTpl = false;
                    $scope.bodyApp = "bodyApp";
                    /*
                    * Get Static Ressources
                    */
                    $scope.toothElements = editeurService.getElementsBlocks;
                    $scope.containers = editeurService.getContainerBlocks;


                    /*
                     * Set the tabsmenu active
                     */
                    $scope.tabsMenu = {
                        active: 0
                    };

                    /*
                    * Model Document
                    */
                    var vm = this;
                    vm.documentModel = {
                        empty:true,
                        applyImg:false,
                        isDirty:false
                    };
                    vm.privateUrl = "";

                    vm.lessTplStyle = null;
                    vm.toothpickLessStyle = styleSetFct.toothpickLessStyle;
                    //$rootScope.toothpickCommonsCss = styleSetFct.toothpickCssStyle;
                    $rootScope.arrayVarLess = styleSetFct.arrayCommonLessVariables;

                    /**
                     * @ngdoc function
                     * @name matchColorAndDesc
                     * @param {Object} colors document color_set_content
                     * @param {String} styleSetUrl document style_set
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Get style set description and apply to colors set
                     */
                    vm.matchColorAndDesc = function(colors, styleSetUrl) {
                        apiTplStore.getOne(styleSetUrl).then(function(result){
                            var properties = result.data.properties;
                            var colorDesc = editeurService.matchPropertiesAndColor(colors, properties);
                            $scope.setColors = colorDesc;
                        });
                    };

                    /**
                     * @ngdoc function
                     * @name returnColorObj
                     * @param {Object} colorSet document color_set
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description transform application colorset to original format
                     * @returns {Object} Original format color
                     */
                    vm.returnColorObj = function(colorSet) {
                        var originalFormatColor = {};
                        _.forOwn(colorSet, function(v, k) {
                            originalFormatColor[k] = colorSet[k].color;
                        });
                        return originalFormatColor;
                    };

                    /**
                     * @ngdoc function
                     * @name removeStylingElements
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description remove all style attributes on button element
                     */
                    vm.removeStylingElements = function() {
                        var stylingElement = document.querySelectorAll('.crunchWrapper .crunchButton[style]');
                        angular.forEach(stylingElement, function(el) {
                            el.removeAttribute("style");
                        });
                    };

                    /**
                     * @ngdoc function
                     * @name createDoc
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description Create a document
                     */
                    function createDoc() {
                        /**
                         * Auto Create document draft
                         */
                        editeurService.createDoc(vm, $scope.renderCode).then(function(response) {
                            cmNotify.message(gettextCatalog.getString('Draft saved'), 'success');
                            vm.documentModel.url = response.data.url;
                            $rootScope.urlDocSaved = response.data.url;
                            $log.debug("draft created");
                            $rootScope.refIdTpl = response.data.url;
                            /*
                             * Update the message
                             */
                            $rootScope.spinner.opaque = false;
                            $log.debug("vm appEditeur");

                            editeurService.updateMessage(vm, $scope.renderCode).then(function() {
                                cmNotify.message(gettextCatalog.getString('Message updated'), 'success');
                            });
                        }, function(error) {
                            cmNotify.message(gettextCatalog.getString('Your draft has not been saved'), 'error');
                            _.forOwn(error.data, function(v, k) {
                                if(k === "color_set") {
                                    cmNotify.message(gettextCatalog.getString('You must first add a color set'), 'error');
                                }
                                else if (k === "style_set") {
                                    cmNotify.message(gettextCatalog.getString('You must first select a style set'), 'error');
                                }
                            });
                        });
                    }

                    /**
                     * @ngdoc function
                     * @name autoCreate
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description Auto create document if it's a template
                     * @param {Object} vm passing controller with documentModel
                     */
                    function autoCreate(vm) {
                        var deleteRequestTpl = [];
                        if(vm.documentModel.is_template) {
                            /**
                             * Get Message
                             */
                            apiMessage.getOne(vm.documentModel.message).then(function(message) {
                                /**
                                 * then get templates 
                                 */
                                apiTplStore.getTpl(message.data.id).then(function(result) {
                                    if(result.length > 0) {
                                        /**
                                         * Push delete request
                                         */
                                        for (var i = 0; i < result.length; i++) {
                                            deleteRequestTpl.push(apiTplStore.delete(result[i].url));
                                        }
                                        /**
                                         * Delete old document
                                         */
                                        $q.all(deleteRequestTpl).then(function(tplDeletedResult) {
                                            $log.debug("tplDeletedResult");
                                            $log.debug(tplDeletedResult);
                                            createDoc();
                                        });
                                    }
                                    else {
                                        createDoc();
                                    }
                                });
                            });

                        }
                    }

                    /**
                     * @ngdoc function
                     * @name loadColorAndStyle
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description Load colorSet and styleSet
                     * @param  {String} color_url   color_set document
                     * @param  {String} style_url   style_set document
                     */
                    vm.loadColorAndStyle = function(color_url, style_url) {
                        /*
                         * Load Colors
                         */
                        apiTplStore.getOne(color_url).then(function(result_color){
                            /*
                             * Add class to color_set
                             */
                            var colors = result_color.data.colors;
                            document.getElementById("id_" + btoa(result_color.data.url)).classList.add("active");

                            $log.debug("result_color.data");
                            $log.debug(result_color.data);
                            /*
                             * Saved color_set DOM
                             */
                            $rootScope.previousElement = document.getElementById("id_"+btoa(result_color.data.url));

                            /*
                             * Save Color Content and Url
                             */
                            $rootScope.savedColorContent = result_color.data.colors;
                            $rootScope.originalColors = result_color.data.colors;

                            /*
                             * Apply to model
                             */
                            vm.documentModel.color_set_content = result_color.data.colors;

                            /**
                             * Apply desciption in style set properties into object color_set
                             * @set scope.setColors
                             */
                            vm.matchColorAndDesc(colors, style_url);

                            /*
                             * Load Style
                             */
                            apiTplStore.getOne(style_url).then(function(result_style){
                                /*
                                 * Save Style Content and Url
                                 */
                                $rootScope.savedStyleContent = result_style.data.content;
                                $rootScope.savedStyleUrl = result_style.data.url;

                                /*
                                 * Apply to model
                                 */
                                vm.documentModel.style_set_content = result_style.data.content;

                                var objectStyleSet = CSSJSON.toJSON(result_style.data.content);
                                /*
                                 * set styleToEdit with tpl rules object
                                 */
                                $rootScope.arrayVarLess = styleSetFct.initArrayCommonLessVariables(objectStyleSet.attributes);
                                $rootScope.styleToEdit = editStyleSetFactory.createArrayTplRules(objectStyleSet.attributes);

                                /*
                                 * Set global template less style
                                 */
                                vm.lessTplStyle = vm.toothpickLessStyle + $rootScope.globalStyle + result_style.data.content;
                                vm.lessColor = styleSetFct.createVariablesLess(result_color.data.colors);

                                /*
                                 * Apply to template
                                 */
                                less.render(vm.lessTplStyle + vm.lessColor, function(e, output) {
                                    if(e === null) {
                                        $rootScope.styleTpl = output.css;
                                    }else {
                                        $log.warn("error colorset less compilation");
                                        $log.debug(e);
                                    }
                                });

                                autoCreate(vm);
                            });
                        });
                    };

                    vm.indexColor = 0;

                    /**
                     * @ngdoc function
                     * @name initDoc
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description Initialization document
                     * @param {Object} data all document data
                     */

                    vm.initDoc = function(data) {
                        vm.documentModel = data;
                        vm.documentModel.message = appSettings.urlMessage;
                        vm.documentModel.empty = false;
                        vm.documentModel.type = null;
                        $rootScope.urlDocSaved = data.url;

                        /*
                         * JSON data template
                         */
                        $scope.renderCode = data.content;

                        /**
                         * Check header/footer configuration
                         */
                        if(_.has($scope.renderCode[0], "headerText")) {
                            $log.debug("footer/header");
                            editeurService.header = $scope.renderCode[0];
                            $rootScope.header = editeurService.header;
                            $rootScope.footer = $scope.renderCode[$scope.renderCode.length - 1];
                        }else {
                            $log.debug("else footer/header");
                            $rootScope.header = editeurService.header;
                            $rootScope.footer = editeurService.footer;
                            $scope.renderCode.unshift(editeurService.header);
                            $scope.renderCode.push(editeurService.footer);
                        }

                        /**
                         * Generate id to Containers and Blocks
                         */
                        for(var c = 0; c < $scope.renderCode.length; c++) {
                            $scope.renderCode[c].id = "id_" + globalFunction.generateUUID();
                            //$scope.renderCode[c]
                            $scope.renderCode[c].name = editeurService.nameColor[c];
                            vm.indexColor++;
                            if(_.has($scope.renderCode[c], "columns")) {
                                for(var b = 0; b < $scope.renderCode[c].columns.length; b++) {
                                    $scope.renderCode[c].columns[b].id = "id_" + globalFunction.generateUUID();
                                }
                            }else {
                                $log.debug($scope.renderCode[c]);
                            }
                        }

                        /**
                         * Tpl private or draft
                         */
                        if(!data.is_public){
                            $log.debug("data.color_set_content");
                            $log.debug(data.color_set_content);

                            /*
                             * Save color and style sets content and url
                             */
                            $rootScope.savedColorContent = data.color_set_content;
                            $rootScope.savedStyleContent = data.style_set_content;
                            $rootScope.savedStyleUrl = data.style_set;
                            $rootScope.originalColors = data.color_set_content;

                            /*
                             * Check if color_set is dirty to show btn save color_set
                             */
                            if(vm.documentModel.color_set_is_dirty) {
                                $scope.saveColorButton = true;
                            }else {
                                if(!_.isNull(document.getElementById("id_" + base64.encode(data.color_set)))) {
                                    document.getElementById("id_" + base64.encode(data.color_set)).classList.add("active");
                                }
                            }

                            /*
                             * Check if draft or private
                             */
                            if(data.is_template) {
                                vm.documentModel.template = data.template;
                                vm.documentModel.type = "private";
                                $scope.enableUpdateBtnPrivTpl = true;
                                /*
                                 * Set url to udpate pricate tpl
                                 */
                                vm.privateUrl = data.url;
                                vm.privateTplName = data.name;
                                $log.debug("==== PRIVATE TPL ======");
                            }else {
                                vm.documentModel.type = "draft";
                                $rootScope.refIdTpl = data.url;
                                $log.debug("==== DRAFT ======");
                            }
                            /*
                             * Apply desciption in style set properties into object color_set
                             * @set scope.setColors
                             */
                            vm.matchColorAndDesc(data.color_set_content, data.style_set);

                            vm.lessTplStyle = $rootScope.globalStyle + data.style_set_content;

                            vm.lessColor = styleSetFct.createVariablesLess(data.color_set_content);

                            /*
                             * Get less Variables and Init value custom style template
                             */
                            var lessVariables = CSSJSON.toJSON(data.style_set_content).attributes;
                            $rootScope.arrayVarLess = styleSetFct.initArrayCommonLessVariables(lessVariables);

                            $rootScope.styleToEdit = editStyleSetFactory.createArrayTplRules(styleSetFct.arrayCustomLessVariables);

                            /*
                             * Apply to template
                             */
                            less.render(vm.lessTplStyle + vm.lessColor, function(e, output) {
                                 if(e === null) {
                                     $rootScope.styleTpl = output.css;
                                 }else {
                                     $log.warn("error compilation less colorset");
                                     $log.debug(e);
                                 }
                             });

                             /**
                              * Auto create a document
                              */
                             autoCreate(vm);
                        }else if(data.is_public) {
                            /*
                             * Tpl Public
                             */
                            vm.documentModel.type = "public";
                            vm.documentModel.template = data.url;
                            vm.documentModel.color_set_is_dirty = false;
                            vm.documentModel.style_set_is_dirty = false;

                            vm.loadColorAndStyle(data.color_set, data.style_set);
                        }


                    };
                },
                link: function(scope, element, attrs, ctrl) {
                    var stylesheetColor;
                    var stylesheetLayout;
                    $log.debug($location.search());

                    $log.debug("url Draft doc : " + $rootScope.refIdTpl);

                    if(_.has($location.search(), "quick")) {
                        $log.debug("has quick");
                        //scope.quick
                    }

                    /*
                     * Load a template
                     */
                    if($routeParams.url !== "empty") {
                        var urlTpl = atob($routeParams.url);
                        apiTplStore.getOne(urlTpl).then(function(result) {
                            /*
                             * init Template
                             */
                            ctrl.initDoc(result.data);
                        });
                    }else {
                        /*
                         * Create from scratch
                         */
                        $rootScope.header = editeurService.header;
                        /*
                        * Add Class to editor
                        */
                        scope.emptyTpl = true;
                        $rootScope.emptyEditor = true;

                        /*
                         * TODO Remove ?
                         */
                        $rootScope.styleSet = "";
                        $rootScope.styleLayout = "";

                        /*
                         * Init a empty array to have a first element
                         */
                        scope.renderCode = [];
                        scope.renderCode.unshift(editeurService.header);
                        scope.renderCode.push(editeurService.footer);

                        var color_set_url = $rootScope.tplStore + "colorsets/1/";
                        var style_set_url = $rootScope.tplStore + "stylesets/1/";

                        ctrl.documentModel.style_set = style_set_url;
                        ctrl.documentModel.color_set = color_set_url;
                        ctrl.documentModel.message = appSettings.urlMessage;


                        ctrl.loadColorAndStyle(color_set_url, style_set_url);
                    }


                    /*========== Watchers ===========*/

                    //Watch setColors to update style
                    scope.$watch('setColors', function(newValue, oldValue) {
                        var newLessColors = styleSetFct.getLessVariables(newValue);
                        var oldLessColors = styleSetFct.getLessVariables(oldValue);

                        if(!_.isUndefined(oldLessColors) && _.has(oldLessColors, "@primary_color") && !_.isUndefined(ctrl.lessColor)) {
                            _.forOwn(newLessColors, function(v, k) {
                                if(oldLessColors[k] !== v) {
                                    var regexp = new RegExp("(" + k + ":)(#[a-zA-z0-9]*)", "g");

                                    ctrl.lessColor = ctrl.lessColor.replace(regexp, "$1" + v);

                                    less.render(ctrl.lessColor + ctrl.lessTplStyle, function(e, output) {
                                        if(e === null) {
                                            $rootScope.styleTpl = output.css;
                                        }else {
                                            $log.warn("error compilation less colorset");
                                            $log.debug(e);
                                        }
                                    });
                                }
                            });
                        }

                    }, true);

                    /**
                     * @ngdoc function
                     * @name changeColor
                     * @methodOf editeur.directive:cmAppEditeur
                     * @param {Object} e event DOM
                     * @param {Array} color array with colors
                     * @param {String} key key of object ex: secondary_color1
                     * @description ng-change on colorpicker colorSet and set the color into less style of document
                     */
                    scope.changeColor = function(e, color, key) {
                        // $log.debug(ctrl.lessTplStyle);
                        // $log.debug(key);
                        $log.debug(color.length);
                        if(color.length !== 7) {
                            cmNotify.message(gettextCatalog.getString('Please enter a correct value'), 'error');
                        }else {
                            var regexp = new RegExp("(@" + key + ":)(#[a-zA-z0-9]*)", "g");

                            ctrl.lessColor = ctrl.lessColor.replace(regexp, "$1" + color);

                            _.forOwn(ctrl.lessColor, function(v, k) {
                                /*
                                 * Check if color change
                                 */
                                if($rootScope.savedColorContent[k] !== v) {
                                    var newLessColors = globalFunction.lessifyColor(scope.setColors);
                                    var colorSetFormat = ctrl.returnColorObj(scope.setColors);
                                    ctrl.documentModel.color_set_content = colorSetFormat;
                                    /*
                                     * Show btns save and reset
                                     */
                                    scope.saveColorButton = true;
                                    scope.resetActions = true;
                                }
                            });
                        }
                    };

                    var sizeRenderCode = 0;
                    scope.$watch("renderCode", function(n, o) {
                        sizeRenderCode = _.size(n);
                    }, true);


                    function hideColorPicker() {
                        var colorPicker = document.querySelectorAll(".colorSets color-picker");
                        angular.forEach(colorPicker, function(el) {
                            el.classList.add("ng-hide");
                        });
                        //scope.saveColorButton = false;
                    }

                    /**
                     * @ngdoc function
                     * @name showColorPicker
                     * @methodOf editeur.directive:cmAppEditeur
                     * @param {Event} e event DOM
                     * @param {Object} item array with colors
                     * @description
                     * Show color picker
                     */
                    scope.showColorPicker = function(e, item) {
                        e.stopPropagation();
                        if(angular.element(e.target).parent().find("color-picker").hasClass("ng-hide")) {
                            angular.element(e.target).parent().find("color-picker").removeClass("ng-hide");
                            ctrl.removeStylingElements();
                            //scope.saveColorButton = true;
                        }else {
                            angular.element(e.target).parent().find("color-picker").addClass("ng-hide");
                        }
                    };

                    $document.on('click', hideColorPicker);

                    /*
                    * Get all blocks
                    */
                    var urlBlockParent;

                    apiTplStore.getAllBlocks().then(function(result) {
                        var data = result.data.results;
                        for(var b = 0; b < data.length; b++) {
                            data[b].type = "container";
                            data[b].is_container = true;
                            if(data[b].is_public) {
                                scope.blocks.push(data[b]);
                            }
                            else {
                                scope.privateBlocks.push(data[b]);
                            }
                        }
                    });
                    /**
                     * @ngdoc function
                     * @name undo
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Undo a action
                     */
                    scope.undo = function() {
                        actionStack.undo();
                    };

                    /**
                     * @ngdoc function
                     * @name checkIfColorSetIsDirty
                     * @methodOf editeur.directive:cmAppEditeur
                     * @param {Function} callback callback function
                     * @description Show a ng-dialog if color
                     */
                    function checkIfColorSetIsDirty(callback) {
                        _.forOwn($rootScope.savedColorContent, function(v, k) {
                            if(ctrl.documentModel.color_set_content[k] !== v && scope.saveColorButton) {
                                ctrl.documentModel.color_set_is_dirty = true;
                            }
                        });

                        if(ctrl.documentModel.color_set_is_dirty) {
                            var message = gettextCatalog.getString("You have an unsaved Color Set, do you want to save it?");
                            ngDialog.openConfirm({
                                template: 'views/_directives/confirm.html',
                                controller: function($scope) {
                                    $scope.messageConfirm = message;
                                },
                            }).then(function (success) {
                                scope.saveColorSet();
                                callback();
                            }, function() {
                                callback();
                            });
                        }else {
                            callback();
                        }
                    }

                    /**
                     * @ngdoc function
                     * @name updateMessage
                     * @methodOf editeur.directive:cmAppEditeur
                     * @param {Bool} close can close Toothpaste
                     * @param {Function} callback callback function
                     * @description Update message
                     */
                    function updateMessage(close, callback) {
                        var htmlMessage = editeurService.createHtmlMessage(scope.renderCode);
                        var html = {
                            "html": htmlMessage,
                            "properties": {
                                "urlTpl": ctrl.documentModel.url
                            }
                        };
                        if(!_.isUndefined(ctrl.documentModel.message)) {
                            editeurService.messageUrl = ctrl.documentModel.message;
                            apiMessage.updateMessage(ctrl.documentModel.message, html).then(function(result) {
                                cmNotify.message(gettextCatalog.getString('Message updated'), 'success');
                                callback(close);
                            }, function(error) {
                                cmNotify.message(gettextCatalog.getString('Your message has not been updated'), 'error');
                            });
                        }else {
                            $log.warn("message url undefined");
                        }
                    }


                    /**
                     * @ngdoc function
                     * @name responsePrivTpl
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description Response creation and udpate private tpl
                     * @param {String} url url document
                     * @param {Bool} updating if update or create to set the correct user message
                     */
                    function responsePrivTpl(url, updating) {
                        var tpl = document.getElementById("screenshotContainer");
                        /*
                         * Take a screenshot
                         */
                        $log.debug("ctrl.documentModel.thumbnail");
                        $log.debug(ctrl.documentModel.thumbnail);
                        editeurService.screenshot(tpl, url, ctrl.documentModel.thumbnail, function(data) {
                            var thumbnail = {
                                "thumbnail_url": data.file,
                                "thumbnail": data.url
                            };
                            apiTplStore.updateTpl(ctrl.documentModel.url, thumbnail).then(function(response) {
                                $log.debug("response updateTpl");
                                $log.debug(response);
                                ctrl.documentModel.thumbnail = response.data.thumbnail;
                                if(updating) {
                                    cmNotify.message(gettextCatalog.getString('Template updated'), 'success');
                                }else {
                                    cmNotify.message(gettextCatalog.getString('Template saved'), 'success');
                                }


                                $log.debug("private tpl created");
                            }, function(error) {
                                if(updating) {
                                    cmNotify.message(gettextCatalog.getString('Your template has not been updated'), 'success');
                                }else {
                                    cmNotify.message(gettextCatalog.getString('Your template has not been saved'), 'success');
                                }
                                //error.data[]
                                _.forOwn(error.data, function(v, k) {
                                    if(k === "color_set") {
                                        cmNotify.message(gettextCatalog.getString('You must add a color set'), 'error');
                                    }
                                    else if (k === "style_set") {
                                        cmNotify.message(gettextCatalog.getString('You must select a style set'), 'error');
                                    }
                                });
                            });
                        });
                    }

                    /**
                     * @ngdoc function
                     * @name udpatePrivTpl
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Update a private template
                     */
                    scope.udpatePrivTpl = function() {
                        editeurService.updatePrivTpl(ctrl, scope.renderCode).then(function() {
                            ctrl.documentModel.color_set_is_dirty = false;

                            responsePrivTpl(ctrl.privateUrl, true);
                        });
                    };

                    /**
                     * @ngdoc function
                     * @name createPrivTpl
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Create a private template
                     */
                    scope.createPrivTpl = function() {

                        editeurService.createPrivTpl(ctrl, scope.renderCode).then(function(firstResponse) {
                            ctrl.documentModel.url = firstResponse.data.url;
                            ctrl.documentModel.color_set_is_dirty = false;
                            ctrl.privateUrl = firstResponse.data.url;

                            scope.enableUpdateBtnPrivTpl = true;

                            responsePrivTpl(ctrl.privateUrl, false);
                        });
                    };

                    /**
                     * @ngdoc function
                     * @name saveOrUpdateDraft
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Create/Update document draft
                     * @param {Boolean} close boolean to close or not Toothpaste
                     */
                    scope.saveOrUpdateDraft = function(close) {
                        /*
                         * Update footerLogo
                         */
                        var footerLogoEl = document.querySelector("#footerLogoSrc cm-wysiwyg");
                        if(!_.isNull(footerLogoEl)) {
                            $rootScope.footer.footerLogoHtml.html = footerLogoEl.innerHTML;
                        }
                        /*
                         * remove isDirty on Document
                         */
                        ctrl.documentModel.isDirty = false;
                        if(ctrl.documentModel.type === "draft" || !_.isUndefined($rootScope.refIdTpl)) {
                            updateMessage(close, function(close) {
                                editeurService.updateDoc(ctrl, scope.renderCode, $rootScope.refIdTpl).then(function(response) {
                                    cmNotify.message(gettextCatalog.getString("Draft updated"), 'success');
                                    $log.debug("draft updated");
                                    if(close) {
                                        checkIfColorSetIsDirty(function() {
                                            /*
                                             * Close Editor
                                             */

                                            //Reload Message or redirect if createMessage
                                            var url = {
                                                "urlMessage": ctrl.documentModel.message
                                            };
                                            postMessageHandler.post(url);

                                            var objClose = {
                                                "close": true
                                            };
                                            postMessageHandler.post(objClose);
                                        });
                                    }
                                }, function(error) {
                                    cmNotify.message(gettextCatalog.getString('Your draft has not been updated'), 'error');
                                    //error.data[]
                                    _.forOwn(error.data, function(v, k) {
                                        if(k === "color_set") {
                                            cmNotify.message(gettextCatalog.getString('You must add a color set'), 'error');
                                        }
                                        else if (k === "style_set") {
                                            cmNotify.message(gettextCatalog.getString('You must select a style set'), 'error');
                                        }
                                    });
                                });
                            });
                        }else {
                            /*
                             * Clone document...
                             */
                            updateMessage(close, function(close) {
                                editeurService.createDoc(ctrl, scope.renderCode).then(function(response) {
                                    cmNotify.message(gettextCatalog.getString('Draft saved'), 'success');
                                    ctrl.documentModel.url = response.data.url;
                                    $log.debug("draft created");
                                    $rootScope.refIdTpl = response.data.url;
                                    if(close) {
                                        checkIfColorSetIsDirty(function() {
                                            /*
                                             * Close Editor
                                             */

                                            //Reload Message or redirect if createMessage
                                            var url = {
                                                "urlMessage": ctrl.documentModel.message
                                            };
                                            postMessageHandler.post(url);

                                            var objClose = {
                                                "close": true
                                            };
                                            postMessageHandler.post(objClose);
                                        });
                                    }
                                }, function(error) {
                                    cmNotify.message(gettextCatalog.getString('Your draft has not been saved'), 'error');
                                    //error.data[]
                                    _.forOwn(error.data, function(v, k) {
                                        if(k === "color_set") {
                                            cmNotify.message(gettextCatalog.getString('You must add a color set'), 'error');
                                        }
                                        else if (k === "style_set") {
                                            cmNotify.message(gettextCatalog.getString('You must select a style set'), 'error');
                                        }
                                    });
                                });
                            });
                        }
                    };

                    /*
                    * Drop callback
                    */
                    var contenteditables = null;
                    $timeout(function() {
                        contenteditables = document.querySelectorAll("*[contenteditable]");
                    }, 2000);

                    /**
                     * @ngdoc function
                     * @name dropCallback
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Callback after move a element/block/container
                     * @param {Event} e DOM event
                     * @param {Number} index Array index
                     * @param {Object} item The object element/container/block
                     * @param {Boolean} external Whether the element was dragged from an external source
                     * @param {String} type element type
                     */
                    scope.dropCallback = function(e, index, item, external, type) {
                        var itemToPush = {};
                        if(item.is_container) {
                            itemToPush = {
                                "id": "id_" + globalFunction.generateUUID(),
                                "type":"container",
                                "is_container": true,
                                "tplContainer": "listNoDrop",
                                "columns":[],
                                "classContainer": "",
                                "editor_conf": item.editor_conf,
                                "name": editeurService.nameColor[ctrl.indexColor]
                            };

                            if(item.hasOwnProperty('columns') && item.columns.length > 0) {
                                item.id = "id_" + globalFunction.generateUUID();
                                item.name = editeurService.nameColor[ctrl.indexColor];
                                for (var c = 0; c < item.columns.length; c++) {
                                    item.columns[c].id = "id_" + globalFunction.generateUUID();
                                }
                                itemToPush = item;
                            }else {
                                var convertedHtml = globalFunction.convertToNode(item.html);
                                var divs = convertedHtml.querySelectorAll("div");

                                itemToPush.divClass = convertedHtml.className;
                                itemToPush.classContainer = convertedHtml.children[0].className;

                                for(var d = 0; d < divs.length; d++) {
                                    var arrTds = [];
                                    var childs = divs[d];
                                    for(var i = 0; i < childs.children.length; i++) {
                                        var content = {
                                            "id": "id_" + globalFunction.generateUUID(),
                                            "type": "item",
                                            "tdClass":childs.children[i].className,
                                            "html":childs.children[i].outerHTML,
                                            "editor_conf": childs.children[i].getAttribute('data-conf')
                                        };
                                        arrTds.push(content);
                                        arrTds.id = "id_" + globalFunction.generateUUID();
                                    }
                                    itemToPush.columns.push(arrTds);
                                }
                            }

                        }else {
                            itemToPush = {
                                "id": "id_" + globalFunction.generateUUID(),
                                "type": "item",
                                "html": item.html,
                                "editor_conf": item.editor_conf
                            };
                        }
                        ctrl.indexColor++;
                        angular.forEach(contenteditables, function(el) {
                            el.setAttribute("contenteditable", "true");
                        });

                        return itemToPush;
                    };

                    /**
                     * @ngdoc function
                     * @name dragCallback
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Callback after begin to drag a element
                     * We remove contenteditable attribute
                     * @param {Event} event DOM event
                     * @param {Number} index Array index
                     * @param {Object} item Item object
                     */
                    scope.dragCallback = function(event, index, item) {
                        angular.forEach(contenteditables, function(el) {
                            el.removeAttribute("contenteditable");
                        });
                        return index < 10;
                    };

                    /*
                    * Start drag function
                    */
                    var parentStartDrag;
                    /**
                     * @ngdoc function
                     * @name dragCallback
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Callback on start to drag a element
                     * We check if element is empty or not
                     * @param {Event} e DOM event
                     */
                    scope.dragStart = function(e) {
                        /*
                         * Add min-height to parent to drop element
                         */
                        parentStartDrag = angular.element(e.target).parent();
                        if(angular.element(e.target).parent().children().length < 2) {
                            angular.element(e.target).parent().addClass("empty");
                        }
                    };

                    /**
                     * @ngdoc function
                     * @name insertedItem
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Set some attributes on our element, a widthTable and divPadding, use in html generation for outlook
                     * @param {Event} event DOM event
                     * @param {Object} item Item object
                     */
                    scope.insertedItem = function(e, item) {
                        ctrl.documentModel.isDirty = true;
                        if(item.is_container) {
                            if(!_.isNull(document.getElementById(item.id))) {
                                var el = document.getElementById(item.id).querySelector('div');
                                var widthTable = el.offsetWidth;
                                var divPadding = getComputedStyle(el).padding.split("px");
                                item.widthTable = widthTable;
                                item.divPadding = divPadding[0];
                            }
                        }
                        if(angular.element(e.target).parent().hasClass("empty")) {
                            angular.element(e.target).parent().removeClass("empty");
                        }
                    };

                    /**
                     * @ngdoc function
                     * @name deleteElement
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Delete a element
                     * @param {Object} item The object to delete
                     * @param {Array} sourceArray The template array with all objects
                     * @param {Boolean} isDropEvent Check if it's a drop event
                     */
                    scope.deleteElement = function(item, sourceArray, isDropEvent) {
                        ctrl.documentModel.isDirty = true;
                        blockFactory.deleteElement(item, sourceArray, isDropEvent);
                    };

                    /**
                     * @ngdoc function
                     * @name duplicate
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Duplicate a block
                     * @param {Object} item The object to duplicate
                     * @param {Array} sourceArray The template array with all objects
                     * @param {Number} idx The index array
                     */
                    scope.duplicate = function(item, sourceArray, idx) {
                        ctrl.documentModel.isDirty = true;
                        blockFactory.duplicate(item, sourceArray, idx);
                    };

                    /**
                     * @ngdoc function
                     * @name hideWysToolbar
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Hide wysiwyg toolbar
                     */
                    scope.hideWysToolbar = function() {
                        wysService.hideAllToolbars();
                    };

                    /**
                     * @ngdoc function
                     * @name saveBlock
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Save a new block (Commented in template)
                     * @param {Object} item The object to save
                     */
                    scope.saveBlock = function(item) {
                        var objBlock = blockFactory.saveBlock(item);
                        apiTplStore.createBlock(obj).then(function(result) {
                            cmNotify.message(gettextCatalog.getString("Block saved"), "success");
                            result.data.type = "container";
                            scope.privateBlocks.push(result.data);
                        });
                    };

                    /**
                     * @ngdoc function
                     * @name previewHTML
                     * @methodOf editeur.directive:cmAppEditeur
                     * @description
                     * Open a dialog to display the template
                     */
                    scope.previewHTML = function() {
                        ngDialog.open({
                            template: '<cm-preview html="html"></cm-preview>',
                            plain: true,
                            controller: function($scope) {
                                var htmlMessage = editeurService.createHtmlMessage(scope.renderCode, true);
                                //$log.debug(htmlMessage);
                                $scope.html = htmlMessage;
                            },
                            className: 'custom-ngdialog-fullscreen'
                        });
                    };

                    scope.isSmallScreen = false;

                    /**
                     * Check if form is dirty
                     */
                    var locationChangeStart = $rootScope.$on('$locationChangeStart', function(event, next) {
                        if(ctrl.documentModel.isDirty || ctrl.documentModel.color_set_is_dirty) {
                            var message = gettextCatalog.getString("Are you sure to change page? Your unsaved changes will be lost.");
                            event.preventDefault();
                            ngDialog.openConfirm({
                                template: 'views/_directives/confirm.html',
                                controller: function($scope) {
                                    $scope.messageConfirm = message;
                                },
                            }).then(function (success) {
                                $location.$$parse(next);
                                locationChangeStart();
                            });
                        }else {
                            locationChangeStart();
                        }
                    });


                    /**
                     * Prevent memory leak
                     */
                    scope.$on('$destroy', function(event, data) {
                        $document.off('click', hideColorPicker);
                        /*
                         * Clean Action Stack
                         */
                        $rootScope.showActionStack = false;
                        actionStack.stack = [];
                    });

                }
            };
        };

        module.exports = directive;

    }());
