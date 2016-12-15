/**
 * @ngdoc directive
 * @name tpl_store.directive:cmListTplPreview
 * @restrict E
 * @scope
 * @param {Object} cmTpl Passing API document
 * @param {Number} tplIndex Array index
 * @param {Array} allTpl Array with all documents
 */
(function () {
    'use strict';
    var directive = function() {
        return {
            templateUrl:'views/tpl_store/_list_tpl_preview.html',
            scope: {
                'cmTpl': "=",
                'tplIndex': "=",
                'allTpl': "="
            },
            link: function(scope, element, attr) {
                scope.tplPreview = scope.cmTpl;
                var idxTpl = scope.tplIndex;
                /**
                 * @ngdoc function
                 * @name prevTpl
                 * @methodOf tpl_store.directive:cmListTplPreview
                 * @description
                 * Get previous template
                 */
                scope.prevTpl = function() {
                    scope.allTpl[idxTpl].active = false;
                    scope.allTpl[idxTpl - 1].active = true;
                };
                /**
                 * @ngdoc function
                 * @name nextTpl
                 * @methodOf tpl_store.directive:cmListTplPreview
                 * @description
                 * Get next template
                 */
                scope.nextTpl = function() {
                    scope.allTpl[idxTpl].active = false;
                    scope.allTpl[idxTpl + 1].active = true;
                };
                /**
                 * @ngdoc function
                 * @name showPreview
                 * @methodOf tpl_store.directive:cmListTplPreview
                 * @description
                 * Show the template preview
                 * @param {Object} tpl API document
                 */
                scope.showPreview = function(tpl) {
                    tpl.active = !tpl.active;
                    if(tpl.active) {
                        document.body.classList.add("overflowHideBody");
                    }else {
                        document.body.classList.remove("overflowHideBody");
                    }
                };

                /**
                 * @ngdoc function
                 * @name removeBodyClass
                 * @methodOf tpl_store.directive:cmListTplPreview
                 * @description
                 * Remove overflowHideBody class on element body
                 */
                scope.removeBodyClass = function() {
                    document.body.classList.remove("overflowHideBody");
                };
            }
        };
    };

    module.exports = directive;
}());
