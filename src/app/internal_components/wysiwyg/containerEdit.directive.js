/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmContainerEdit
 * @restrict E
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires https://docs.angularjs.org/api/ng/service/$timeout
 * @requires https://docs.angularjs.org/api/ng/service/$compile
 * @requires wysiwyg.factory:wysService
 * @requires Lodash
 * @requires _factory.factory:globalFunction
 * @requires gettextCatalog
 * @scope
 * @param {Object} container Passing container
 * @param {String} type Passing container type
 * @description
 * Edit style container
 */
(function () {
    'use strict';
    var directive = function(_, $log, $compile, $timeout, wysService, globalFunction, gettextCatalog) {
        var containerTplWysiwyg = [
            '<div id="wysiwygContainer-{{id}}" class="wysiwygContainer" ng-class="{ \'active\': toolbarVisible }">',
                '<div class="toolbarContainer">',
                    '<div class="closeWysiwygContainer" ng-click="removeWys()">✕</div>',
                    '<ul class="ul-reset toolbarButtons formAlignContainer">',
                        '<li>',
                            '<button class="btn-toothwys btn-valign icon-format-align-left" ng-class="{\'active\': isActiveAlign === \'l\'}" ng-click="horizontalAlign($event, \'crunchTal\')"></button>',
                        '</li>',
                        '<li>',
                            '<button class="btn-toothwys btn-valign icon-format-align-center" ng-class="{\'active\': isActiveAlign === \'c\'}" ng-click="horizontalAlign($event, \'crunchTac\')"></button>',
                        '</li>',
                        '<li>',
                            '<button class="btn-toothwys btn-valign icon-format-align-right" ng-class="{\'active\': isActiveAlign === \'r\'}" ng-click="horizontalAlign($event, \'crunchTar\')"></button>',
                        '</li>',
                        '<li ng-if="containerWithCols">',
                            '<button class="btn-toothwys btn-valign icon-valignTop" ng-class="{\'active\': isActiveVAlign === \'Top\'}" ng-click="verticalAlign($event, \'crunchBlockValignTop\')"></button>',
                        '</li>',
                        '<li ng-if="containerWithCols">',
                            '<button class="btn-toothwys btn-valign icon-valignMiddle" ng-class="{\'active\': isActiveVAlign === \'Middle\'}" ng-click="verticalAlign($event, \'crunchBlockValignMiddle\')"></button>',
                        '</li>',
                        '<li ng-if="containerWithCols">',
                            '<button class="btn-toothwys btn-valign icon-valignBottom" ng-class="{\'active\': isActiveVAlign === \'Bottom\'}" ng-click="verticalAlign($event, \'crunchBlockValignBottom\')"></button>',
                        '</li>',
                    '</ul>',
                    '<div class="form-wysiwyg" ng-click="$event.stopPropagation();">',
                        '<input id="checkbox-{{idFullWidth}}" type="checkbox" ng-model="fullWidth" ng-change="toggleClassContainer(\'crunchFitBlock\', \'crunchFitBlock\')"/>',
                        '<label for="checkbox-{{idFullWidth}}">' + gettextCatalog.getString('Set container to full width') + '</label>',
                    '</div>',
                    '<div class="form-wysiwyg" ng-click="$event.stopPropagation();">',
                        '<cm-wysiwyg-color-picker bg-color-model="buttonModel.bgcolor" change-fct="changeColor($event, color)" text="textBgColor"></cm-wysiwyg-color-picker>'+
                    '</div>',
                '</div>',
            '</div>'
        ].join('');
        return {
            restrict: 'A',
            scope: {
                'container': "=",
                'type': "@"
            },
            controller: function($scope, $element) {
                /*
                 * TODO find another solution
                   generate id to enable id/for on input/label element
                 */
                $scope.idFullWidth = globalFunction.generateUUID();
                $scope.idToggleInnerMarge = globalFunction.generateUUID();
                $scope.containerWithCols = false;

                $scope.textBgColor = gettextCatalog.getString('Background color');
            },
            link: function(scope, element, attrs) {
                var regexpAlign = new RegExp("\\s?crunchTa(\\w*)", "g");
                var regexpVAlign = new RegExp("\\s?crunchBlockValign(\\w*)", "g");
                scope.buttonModel = {
                    bgcolor: null
                };
                if(_.has(scope.container, "columns")) {
                    if(scope.container.columns.length > 1) {
                        scope.containerWithCols = true;
                    }
                }

                var divClass = scope.container.divClass;

                scope.id = scope.container.id;
                /*
                 * Compile template
                 */
                var content = $compile(containerTplWysiwyg)(scope);

                /**
                 * Update document content model JSON
                 */
                function applyToJsonElement() {
                    if(element[0].children[0].getAttribute("style") !== null) {
                        scope.container.style = element[0].children[0].getAttribute("style");
                    }
                }
                if(scope.type !== "placeholder") {
                    element.on("click", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        /**
                         * Get all element with the class highlight and remove it
                         */
                        var highlightElements = document.querySelectorAll(".highlight_container");
                        var wysiwygContainers = document.querySelectorAll(".wysiwygContainer");
                        _.forOwn(highlightElements, function(element) {
                            angular.element(element).removeClass("highlight_container");
                        });

                        _.forOwn(wysiwygContainers, function(el) {
                            if(el.id !== "wysiwygContainer-" + scope.id) {
                                angular.element(el).removeClass("active");
                            }
                        });

                        /**
                         * Add class highlight on our element
                         */
                        element.addClass("highlight_container");
                        document.getElementById("wysiwygContainer-" + scope.id).classList.toggle("active");
                    });
                }
                /*
                 * Append to body
                 */
                angular.element(document.body).append(content);

                /*
                 * Init Values
                 */
                $timeout(function() {
                    /*
                     * Get element background color
                     */
                    //globalFunction.rgbToHex()
                    var containerBgColor = wysService.getRgbColor(getComputedStyle(element[0].children[0]).backgroundColor);
                    if(!_.isNull(containerBgColor)) {
                        scope.buttonModel.bgcolor = globalFunction.rgbToHex(containerBgColor.r, containerBgColor.g, containerBgColor.b);
                        $log.debug("scope.buttonModel.bgcolor");
                        $log.debug(scope.buttonModel.bgcolor);
                    }
                    /*
                     * Set checkbox fit block
                     */
                    if(angular.element(element).children().hasClass("crunchFitBlock")) {
                        scope.fullWidth = true;
                    }

                    var valueAlign = regexpAlign.exec(scope.container.divClass);
                    var valueVAlign = regexpVAlign.exec(scope.container.divClass);
                    if(!_.isNull(valueAlign)) {
                        scope.isActiveAlign = valueAlign[1];
                    }
                    else {
                        scope.isActiveAlign = "l";
                    }
                    if(!_.isNull(valueVAlign)) {
                        scope.isActiveVAlign = valueVAlign[1];
                    }
                    else {
                        scope.isActiveVAlign = "Middle";
                    }
                }, 2000);

                 /**
                  * @ngdoc function
                  * @name removeWys
                  * @methodOf wysiwyg.directive:cmContainerEdit
                  * @description
                  * Hide all toolbarWys
                  */
                 scope.removeWys = function() {
                     wysService.hideAllToolbars();
                     applyToJsonElement();
                 };

                 /**
                  * @ngdoc function
                  * @name changeColor
                  * @methodOf wysiwyg.directive:cmContainerEdit
                  * @description
                  * Change container background color
                  * @param {Event} e Passing DOM event
                  * @param {String} color The color to apply
                  */
                 scope.changeColor = function(e, color) {
                     element[0].children[0].style.backgroundColor = color;
                     applyToJsonElement();
                 };

                 /**
                  * @ngdoc function
                  * @name toggleClassContainer
                  * @methodOf wysiwyg.directive:cmContainerEdit
                  * @description
                  * Change container background color
                  * @param {String} classToAdd The class to add
                  * @param {String} regex A Regular expression to find the correct class
                  */
                 scope.toggleClassContainer = function(classToAdd, regex) {
                     var regexp = new RegExp(regex, 'g');
                     if(scope.container.divClass.match(regexp)) {
                         scope.container.divClass = scope.container.divClass.replace(regexp, '');
                     }else {
                         scope.container.divClass += ' ' + classToAdd;
                     }
                     applyToJsonElement();
                 };

                 function removeClassContainer(regexp) {
                     if(scope.container.divClass.match(regexp)) {
                         scope.container.divClass = scope.container.divClass.replace(regexp, '');
                     }
                 }

                 /**
                  * @ngdoc function
                  * @name verticalAlign
                  * @methodOf wysiwyg.directive:cmContainerEdit
                  * @description
                  * Add a class to change the container vertical alignement
                  * @param {Event} e Passing DOM event
                  * @param {String} classToApply The class to apply on the container
                  */
                 scope.verticalAlign = function(e, classToApply) {
                     var btnvalign = document.querySelectorAll(".toolbarContainer .btn-valign");
                     angular.forEach(btnvalign, function(btn) {
                         angular.element(btn).removeClass("active");
                     });

                     angular.element(e.target).toggleClass("active");
                     /*
                      * Reset Classes
                      */
                     removeClassContainer(regexpVAlign);
                     /*
                      * Apply class to container
                      */
                     scope.container.divClass += " " + classToApply;
                     applyToJsonElement();
                 };

                 /**
                  * @ngdoc function
                  * @name verticalAlign
                  * @methodOf wysiwyg.directive:cmContainerEdit
                  * @description
                  * Add a class to change the container horizontal alignement
                  * @param {Event} e Passing DOM event
                  * @param {String} classToApply The class to apply on the container
                  */
                 scope.horizontalAlign = function(e, classToApply) {
                     var btnvalign = document.querySelectorAll(".toolbarContainer .btn-valign");
                     angular.forEach(btnvalign, function(btn) {
                         angular.element(btn).removeClass("active");
                     });

                     angular.element(e.target).toggleClass("active");
                     /*
                      * Reset Classes
                      */
                     removeClassContainer(regexpAlign);
                     /*
                      * Apply class to container
                      */
                     scope.container.divClass += " " + classToApply;
                     applyToJsonElement();
                 };
            }
        };
    };
    module.exports = directive;
}());
