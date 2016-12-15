/**
 * @ngdoc directive
 * @name editeur.directive:cmContainerDragDrop
 * @restrict E
 * @requires _factory.factory:globalFunction
 * @requires Lodash
 * @scope
 * @param {Object} obj passing containers element
 * @param {Object} activateMenu Passing Boolean
 * @description
 * Menu to drag and drop container
 */
(function () {
    'use strict';

    var directive = function(_, globalFunction) {
        return {
            restrict: "E",
            templateUrl: 'views/editeur/_containerDragDrop.html',
            scope: {
                'obj': "=",
                'activateMenu': "="
            },
            link: function(scope, element, attrs) {
                var sizeObj = 0;
                /**
                 * @ngdoc function
                 * @name openMenu
                 * @methodOf editeur.directive:cmContainerDragDrop
                 * @description
                 * Open the menu to drag and drop containers
                 */
                scope.openMenu = function() {
                    scope.activateMenu = !scope.activateMenu;
                    _.forOwn(scope.obj, function(v, k) {
                        v.draggable = !v.draggable;
                    });
                };
                scope.$watch("obj", function(n, o) {
                    sizeObj = _.size(n);
                }, true);

                /**
                 * @ngdoc function
                 * @name dropCallback
                 * @methodOf editeur.directive:cmContainerDragDrop
                 * @description
                 * Drop callback
                 * @param {Event} e DOM event
                 * @param {Number} index Array index
                 * @param {Object} item The object element/container/block
                 * @param {Boolean} external Whether the element was dragged from an external source
                 * @param {String} type element type
                 */
                scope.dropCallback = function(event, index, item, external, type) {
                    if(index !== 0 && index !== sizeObj && _.has(item, "name")) {
                        item.id = "id_" + globalFunction.generateUUID();
                        for (var c = 0; c < item.columns.length; c++) {
                            item.columns[c].id = "id_" + globalFunction.generateUUID();
                        }
                        return item;
                    }
                };

                /**
                 * @ngdoc function
                 * @name addHighlightContainer
                 * @methodOf editeur.directive:cmContainerDragDrop
                 * @description
                 * Add a highlight to container elemet
                 * @param {Object} item Container element
                 */
                scope.addHighlightContainer = function(item) {
                    if(item.type === "container") {
                        document.getElementById(item.id).style.boxShadow = "inset 0 0 0 5pt " + item.name;
                        document.getElementById(item.id).style.position = "relative";
                        document.querySelector("#" + item.id + " .container-name").style.display = "block";
                        document.querySelector("#" + item.id + " .container-name").style.backgroundColor = item.name;
                        document.querySelector("#" + item.id + " .container-name").textContent = item.name;
                    }
                };

                /**
                 * @ngdoc function
                 * @name removeHighlightContainer
                 * @methodOf editeur.directive:cmContainerDragDrop
                 * @description
                 * Remove a highlight to container elemet
                 * @param {Object} item Container element
                 */
                scope.removeHighlightContainer = function(item) {
                    if(item.type === "container") {
                        document.getElementById(item.id).style.boxShadow = "none";
                        document.querySelector("#" + item.id + " .container-name").style.display = "none";
                    }
                };
            }
        };
    };

    module.exports = directive;
}());
