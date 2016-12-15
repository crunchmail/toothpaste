/**
 * @ngdoc service
 * @name editeur.factory:blockFactory
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires _factory.factory:actionStack
 * @requires _factory.factory:globalFunction
 * @description
 * Functions for block
 */
(function () {
    'use strict';

    var factory = function($rootScope, actionStack, globalFunction) {
        return {
            /**
             * @ngdoc function
             * @methodOf editeur.factory:blockFactory
             * @name saveBlock
             * @description
             * Save a new block, return a object block for the API
             */
            saveBlock: function() {
                /*
                 * Create html
                 */
                var html = '<div class="' + item.divClass + '">' +
                '<table cellpadding="0" cellspacing="0" align="center" class="' + item.classContainer + '" width="100%">'+
                '<tr>'+
                '<td>';
                for(var c = 0; c < item.columns.length; c++) {
                    html += '<div>';
                    var contentHtml = item.columns[c];
                    for(var h = 0; h < contentHtml.length; h++) {
                        html += item.columns[c][h].html;
                    }
                    html += '</div>';
                }
                html += '</td>'+
                '</tr>'+
                '</table>'+
                '</div>';

                /*
                 * Crete object block
                 */
                var obj = {
                    "id": globalFunction.generateUUID(),
                    "is_container": item.is_container,
                    "html": html,
                    "editor_config": {
                        "content": "{}"
                    },
                    "icon":"https://cdn.crunchmail.net/assets/templates/blocks/icon-custom-block.svg",
                    "parent_block": urlBlockParent,
                    "tags": ["private"]
                };

                return obj;
            },
            /**
             * @ngdoc function
             * @methodOf editeur.factory:blockFactory
             * @name deleteElement
             * @description
             * Delete a element
             * @param {Object} item The object to delete
             * @param {Array} sourceArray The template array with all objects
             * @param {Boolean} isDropEvent Check if it's a drop event
             */
            deleteElement: function(item, sourceArray, isDropEvent) {
                angular.forEach(sourceArray, function(obj, index){
                    if (obj.$$hashKey === item.$$hashKey) {
                        // remove the matching item from the array
                        var saveObj = obj;
                        sourceArray.splice(index, 1);
                        if(!isDropEvent) {
                            actionStack.push(function() {
                                sourceArray.splice(index, 0, obj);
                            });
                        }
                        return;
                    }
                });
            },
            /**
             * @ngdoc function
             * @name duplicate
             * @methodOf editeur.factory:blockFactory
             * @description
             * Duplicate a block
             * @param {Object} item The object to duplicate
             * @param {Array} sourceArray The template array with all objects
             * @param {Number} idx The index array
             */
            duplicate: function(item, sourceArray, idx) {
                var cloneObj = angular.copy(item);
                cloneObj.id = globalFunction.generateUUID();
                if(cloneObj.is_container) {
                    var nbrCol = cloneObj.columns;
                    for(var c = 0; c < nbrCol.length; c++) {
                        cloneObj.columns[c].id = globalFunction.generateUUID();
                    }
                }
                sourceArray.splice(idx, 0, cloneObj);
                actionStack.push(function() {
                    sourceArray.splice(idx, 1);
                });
            }
        };
    };
    module.exports = factory;
}());
