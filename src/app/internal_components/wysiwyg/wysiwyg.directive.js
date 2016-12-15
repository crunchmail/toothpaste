/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmWysiwyg
 * @restrict E
 * @requires https://docs.angularjs.org/api/ng/service/$timeout
 * @requires https://docs.angularjs.org/api/ng/service/$compile
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires https://docs.angularjs.org/api/ng/service/$window
 * @requires wysiwyg.factory:wysService
 * @requires _factory.factory:globalFunction
 * @requires gettextCatalog
 * @requires Lodash
 * @requires https://github.com/likeastore/ngDialog
 * @description
 * Upload a image on drop event
 */
(function () {
    'use strict';
    var directive = function($timeout, $compile,
                    $log, wysService, _, $window,
                    ngDialog, globalFunction, gettextCatalog) {
        var wysiwygTpl = "<div id=\"wys-{{idWys}}\" class=\"wysiwygContainer\" ng-class=\"{ 'active': toolbarVisible }\">"+
            "<div class=\"toolbarContainer\">"+
                "<div class=\"closeWysiwygContainer\" ng-click=\"removeWys()\">✕</div>"+
                "<ul class=\"ul-reset toolbarButtons\">"+
                    "<li ng-repeat=\"el in defaultButtons\">"+
                        "<button class=\"btn-toothwys\" ng-click=\"actionButton($event, el)\" ng-class=\"el.icon\"></button>"+
                        "<div role=\"tooltip\" class=\"wysiwygTooltip\">{{ tooltip[el.name] }}</div>"+
                    "</li>"+
                "</ul>"+
                "<ul class=\"ul-reset toolbarFormWysiwyg\">"+
                    "<li ng-repeat=\"el in elsWys\">"+
                        "<div ng-if=\"el.type === 'form'\" class=\"form-wysiwyg inline-label\">"+
                            "<label>{{el.name}}</label>"+
                            "<input class=\"form-{{el.name}}\" ng-init=\"formWysiwyg.value = el.initVal\" ng-model=\"formWysiwyg.value\" ng-click=\"$event.stopPropagation();\" ng-keyup=\"applyValue(el.name)\" type=\"number\" />"+
                        "</div>"+
                        "<div ng-if=\"el.type === 'select'\" class=\"form-wysiwyg inline-label\">"+
                            "<cm-wysiwyg-select callback=\"applyToJsonElement(html)\" el=\"el\"></cm-wysiwyg-select>"+
                        "</div>"+
                        "<div class=\"form-wysiwyg\" ng-if=\"el.type === 'bgColor'\" ng-click=\"$event.stopPropagation();\">"+
                            "<cm-wysiwyg-bg-color bg-color=\"{{buttonModel.bgcolor}}\" el=\"el\" callback=\"applyToJsonElement(html)\"></cm-wysiwyg-bg-color>"+
                        "</div>"+
                        "<div ng-if=\"el.type === 'img'\">"+
                            "<cm-upload-img ng-click=\"$event.stopPropagation();\" el=\"elImg\" parent-el=\"itemTooth\"></cm-upload-img>"+
                        "</div>"+
                        "<div ng-if=\"el.type === 'button'\">"+
                            "<cm-wysiwyg-button config=\"buttonConfig\" el=\"el\" callback=\"applyToJsonElement(html)\"></cm-wysiwyg-button>"+
                        "</div>"+
                        "<div ng-if=\"el.type === 'header'\">"+
                            "<cm-wysiwyg-header toolbar-id=\"wys-{{idWys}}\" el=\"el\"></cm-wysiwyg-header>"+
                        "</div>"+
                        "<div ng-if=\"el.type === 'footer'\">"+
                            "<cm-wysiwyg-footer el=\"el\" callback=\"applyToJsonElement(html)\"></cm-wysiwyg-footer>"+
                        "</div>"+
                    "</li>"+
                "</ul>"+
            "</div>"+
        "</div>";
        return {
            restrict: "E",
            scope: {
                'container': "=",
                'confTooth': "@",
                'itemTooth': "="
            },
            require: ['^cmAppEditeur', 'cmWysiwyg'],
            controller: function($scope, $element) {
                var vm = this;
                $scope.elImg = $element;
                $scope.formWysiwyg = {};
                $scope.buttonModel = {};
                /**
                 * @ngdoc property
                 * @name tooltip
                 * @propertyOf wysiwyg.directive:cmWysiwyg
                 * @description
                 * Help tooltip on wysiwyg element
                 */
                $scope.tooltip = {
                    "bold": gettextCatalog.getString("Bold"),
                    "font-family": gettextCatalog.getString("Change font family"),
                    "font-size": gettextCatalog.getString("Change font size"),
                    "color": gettextCatalog.getString("Text color"),
                    "text-align-left": gettextCatalog.getString("Align content left"),
                    "align-left": gettextCatalog.getString("Align content left"),
                    "text-align-right": gettextCatalog.getString("Align content right"),
                    "align-right": gettextCatalog.getString("Align content right"),
                    "text-align-center": gettextCatalog.getString("Center content"),
                    "align-center": gettextCatalog.getString("Center content"),
                    "underline": gettextCatalog.getString("Underline"),
                    "italic": gettextCatalog.getString("Italic"),
                    "removeFormat": gettextCatalog.getString("Remove all styles"),
                    "link": gettextCatalog.getString("Add a link"),
                    "bgColor": gettextCatalog.getString("Background Color"),
                    "unlink": gettextCatalog.getString("Remove link"),
                };

                vm.id = globalFunction.generateUUID();

                $scope.idWys = vm.id;

                /**
                 * @ngdoc function
                 * @name createButtons
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @description
                 * Init wysiwyg buttons
                 */
                vm.createButtons = function(config, el) {
                    var configParsed = wysService.configParser(config, el);
                    $scope.elsWys = configParsed.special;
                    $scope.defaultButtons = configParsed.default;
                };

                /**
                 * @ngdoc function
                 * @name getItem
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @description
                 * return the item
                 */
                vm.getItem = function() {
                    return $scope.itemTooth;
                };

                /**
                 * @ngdoc function
                 * @name getElement
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @description
                 * Return element
                 */
                vm.getElement = function() {
                    return $element;
                };
            },
            link: function(scope, element, attrs, ctrl) {
                var item = scope.itemTooth;
                var isButton = false;
                var saveText = "";
                var content = $compile(wysiwygTpl)(scope);
                angular.element(element).attr("id", "element-" + ctrl[1].id);
                var domElement = document.getElementById("element-" + ctrl[1].id);

                angular.element(element).parent().on("click", function() {
                    addHighLightClass();
                });

                function addHighLightClass() {
                    /**
                     * Get all element with the class highlight and remove it
                     */
                    var highlightElements = document.querySelectorAll(".highlight_item");
                    _.forOwn(highlightElements, function(element) {
                        angular.element(element).removeClass("highlight_item");
                    });

                    /**
                     * Add class highlight on li element
                     */
                    if(scope.confTooth !== "header" && scope.confTooth !== "footer") {
                        element.parent().addClass("highlight_item");
                    }
                }

                /**
                 * @ngdoc function
                 * @name applyToJsonElement
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @param {String} html Passing html
                 * @description
                 * Apply modification on element
                 *
                 */
                scope.applyToJsonElement = function(html) {
                    if(scope.itemTooth !== undefined) {
                        var el = ctrl[1].getElement();
                        detachEventEl(el.children());
                        scope.itemTooth.html = html;
                        if(el.isBusy) {
                            el.isBusy = false;
                        }
                    }
                };

                function applyToJsonElement() {
                    if(scope.itemTooth !== undefined) {
                        $log.debug("call applyToJsonElement");
                        var el = ctrl[1].getElement();
                        detachEventEl(el.children());
                        scope.itemTooth.html = domElement.innerHTML;
                        if(el.isBusy) {
                            el.isBusy = false;
                        }
                    }
                }

                /**
                 * @ngdoc function
                 * @name blurEvent
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @param {Event} e Passing DOM event
                 * @description
                 * On blur event apply html on json element
                 *
                 */
                function blurEvent(e) {
                    var btnToothwys = document.querySelectorAll(".btn-toothwys");
                    _.each(btnToothwys, function(btn) {
                        btn.classList.remove("active");
                    });
                    /*
                     * Check if text is modified
                     */
                    if(saveText !== element[0].textContent) {
                        ctrl[0].documentModel.isDirty = true;
                        saveText = "";
                        scope.applyToJsonElement(element[0].children[0].outerHTML);
                    }
                    //
                    e.stopPropagation();
                }

                /**
                 * @ngdoc function
                 * @name mouseDownEvent
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @param {Event} e Passing DOM event
                 * @description
                 * On mouse down, attach event on element, init button config
                 *
                 */
                function mouseDownEvent(e) {
                    var elementToSelect;
                    if(!element.isBusy) {
                        if(isButton) {
                            elementToSelect = element.find('a');
                            //buttonConfig
                            var styleButtonElement = getComputedStyle(element.find("table")[0]);
                            var buttonBgColor = wysService.getRgbColor(styleButtonElement.backgroundColor);
                            var buttonTextColor = wysService.getRgbColor(styleButtonElement.color);
                            var hexButtonBg = globalFunction.rgbToHex(buttonBgColor.r, buttonBgColor.g, buttonBgColor.b);
                            var hexButtonColor = globalFunction.rgbToHex(buttonTextColor.r, buttonTextColor.g, buttonTextColor.b);
                            scope.buttonConfig = {
                                "color": hexButtonColor,
                                "background": hexButtonBg
                            };

                        }else if(scope.confTooth !== "img" && scope.confTooth !== "imgFooter") {
                            elementToSelect = element.children();
                        }
                        if(scope.confTooth !== "img" && scope.confTooth !== "imgFooter") {
                            if(scope.confTooth !== "header" && scope.confTooth !== "footer" && scope.confTooth !== "button") {
                                elementToSelect.attr("contenteditable", true);
                            }
                            else {
                                element.find('a').on("click", function(evt) {
                                    evt.preventDefault();
                                });
                            }
                            $timeout(function() {
                                attachEventEl(elementToSelect);
                            });
                            element.isBusy = true;
                            /*
                             * Timeout, use to animate
                             */
                        }else {
                            element.find('a').on("click", function(evt) {
                                evt.preventDefault();
                            });
                        }
                    }

                    $timeout(function() {
                        angular.forEach(document.querySelectorAll(".wysiwygContainer"), function(el) {
                            el.classList.remove('active');
                        });
                        content.addClass("active");
                    }, 100);

                    e.stopPropagation();
                }

                /**
                 * @ngdoc function
                 * @name mouseUpEvent
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @param {Event} e Passing DOM event
                 * @description
                 * On mouse up event, Save text content and close all Dialog
                 *
                 */
                function mouseUpEvent(e) {
                    $log.debug("mouseUp event");
                    var btnToothwys = document.querySelectorAll(".btn-toothwys");
                    _.each(btnToothwys, function(btn) {
                        btn.classList.remove("active");
                    });

                    saveText = element[0].textContent;
                    /*
                     * Check state
                     */
                    if(scope.confTooth !== "header" && scope.confTooth !== "footer" && scope.confTooth !== "button") {
                        wysService.checkState(ctrl[1].id);
                    }
                    e.stopPropagation();
                    ngDialog.closeAll();
                }

                /**
                 * @ngdoc function
                 * @name keydownEvent
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @param {Event} e Passing DOM event
                 * @description
                 * Catch Enter key press to insert br instead of tag
                 *
                 */
                function keydownEvent(e) {
                    if(e.keyCode === 13) {
                        /*
                         * Check first element to insert li or br
                         */
                        if(element.children()[0].tagName === "UL") {
                            /*
                             * Normal usage
                             */
                            return;
                        }else {
                            wysService.insertElement("br");
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }

                /**
                 * @ngdoc function
                 * @name attachEventEl
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @param {Node} el The element
                 * @description
                 * Attach event on element
                 *
                 */
                function attachEventEl(el) {
                    el.on("blur", blurEvent);
                    el.on("dbclick mouseup", mouseUpEvent);
                    el.on("keydown", keydownEvent);
                    el.on("paste", pasteEvent);
                }

                /**
                 * @ngdoc function
                 * @name detachEventEl
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @param {Node} el The element
                 * @description
                 * Detach event on element
                 *
                 */
                function detachEventEl(el) {
                    el.off("blur", blurEvent);
                    el.off("dbclick mouseup", mouseUpEvent);
                    el.off("keydown", keydownEvent);
                    el.off("paste", pasteEvent);
                }

                /**
                 * @ngdoc function
                 * @name pasteEvent
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @param {Event} e Passing DOM event
                 * @description
                 * Catch paste event to insert correct html
                 *
                 */
                function pasteEvent(e) {
                    $log.debug("paste event");
                    var lineBreak = /\n/g;
                    e.preventDefault();
                    var cleanText = e.clipboardData.getData("text/plain");
                    var textToReturn = cleanText.replace(lineBreak, "<br/>");

                    document.execCommand('insertHTML', false, textToReturn);
                }

                /*
                 * Init Wysiwyg
                 */
                if(scope.confTooth !== "") {
                    var conf = wysService[scope.confTooth];
                    if(scope.confTooth === "button") {
                        isButton = true;
                    }
                    // wait content loaded and add Class to parent Img
                    else if(scope.confTooth === "header") {
                        scope.headerLinkText = "test";
                    }

                    $timeout(function() {
                        element[0].children[0].classList.add("wys-element");
                        if(element.find('img').length > 0) {
                            element.addClass("uploadImg");
                            $compile(element.find('img'))(scope);
                        }
                        ctrl[1].createButtons(conf, element[0].children[0]);
                        //$log.debug(content);
                        document.getElementById("editionWysiwyg").appendChild(content[0]);
                        //angular.element(document.body).append(content);
                    }, 1000);
                }
                element.isBusy = false;
                element.on("mousedown", mouseDownEvent);

                /**
                 * @ngdoc function
                 * @name actionButton
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @param {Event} e Passing DOM event
                 * @param {Node} el DOM element
                 * @description
                 * Action on wysiwyg button
                 *
                 */
                scope.actionButton = function(e, el) {
                    /*
                     * Set document dirty
                     */
                    ctrl[0].documentModel.isDirty = true;
                    var targetEvent = angular.element(e.target);
                    var existLink;
                    //if(el.name === "link" || el.name === "color") {
                    $log.debug("savedSelection");
                    wysService.savedSelection = wysService.saveSelection(element[0]);
                    //}
                    var node = wysService.getSelectedNode();
                    var link = angular.element(node).find("a");

                    if(isButton && el.name === "link") {
                        existLink = element.find("a").attr("href");
                        wysService.linkModal(element, true, applyToJsonElement);
                        //wysService.linkModal(existLink, element, true, ctrl[1].applyToJsonElement());
                    }else if(el.name === "link" || el.name === "color") {
                        var selection = $window.getSelection().getRangeAt(0);
                        /*
                         * Add condition, because on Chrome and FF, different to select element
                         */
                        if(link.length > 0) {
                            existLink = link.attr("href");
                        }else {
                            existLink = node.getAttribute('href');
                        }
                        if(selection.toString() !== "") {
                            if(el.name === "link") {
                                wysService.linkModal(element[0].children[0], false, applyToJsonElement);
                            }else if(el.name === "color") {
                                wysService.colorModal(element[0], applyToJsonElement, getComputedStyle(node).color);
                            }
                        }else {
                            alert("Merci de sélectionner du texte");
                        }
                    }
                    else if (el.name === "font-size") {
                        $log.debug(el.initVal);
                        wysService.fontSizeModal(element[0], el.initVal, applyToJsonElement);
                    }else if (el.name === "font-family") {
                        wysService.selectModal(element[0], applyToJsonElement);
                    }else if (el.name === "bgColor") {
                        wysService.bgColorModal(el, applyToJsonElement);
                    }else {
                        wysService.action(el.name, element[0].children[0], targetEvent, applyToJsonElement);
                    }
                    $timeout(function() {
                        //if(el.name === "link" || el.name === "color") {
                            wysService.restoreSelection(element[0], wysService.savedSelection);
                        //}
                    });
                    e.stopPropagation();
                };
                 /**
                  * @ngdoc function
                  * @name removeWys
                  * @methodOf wysiwyg.directive:cmWysiwyg
                  * @description
                  * Remove wysiwyg toolbars
                  *
                  */
                 scope.removeWys = function() {
                     wysService.hideAllToolbars();
                     element.parent().removeClass("highlight_item");
                     var highlightElements = document.querySelectorAll(".highlight_container");
                     _.forOwn(highlightElements, function(element) {
                         angular.element(element).removeClass("highlight_container");
                     });
                 };

                /**
                 * @ngdoc function
                 * @name applyValue
                 * @methodOf wysiwyg.directive:cmWysiwyg
                 * @description
                 * Apply value Form like font size
                 *
                 */
                scope.applyValue = function(name) {
                    switch (name) {
                        case "font-size":
                            element[0].children[0].style.fontSize = scope.formWysiwyg.value + 'px';
                            scope.applyToJsonElement(element[0].children[0].outerHTML);
                        break;
                        default:
                        break;
                    }
                };

            }
        };
    };

    module.exports = directive;
}());
