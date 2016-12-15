/**
 * @ngdoc directive
 * @name _directives.directive:cmChangeStyleSet
 * @restrict E
 * @requires tpl_store.factory:apiTplStore
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires https://docs.angularjs.org/api/ng/service/$timeout
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires editeur.factory:editeurService
 * @requires editeur.factory:editStyleSetFactory
 * @requires Lodash
 */
(function () {
    'use strict';
    var directive = function(apiTplStore, styleSetFct, $rootScope, $log, _, editeurService, editStyleSetFactory) {
        var tplChangeStyleSet = '<div ng-show="previewModeStyle" class="btns colorSetBtns">'+
            '<button ng-click="applyStyle()" class="btn x-small-btn validate-btn">Appliquer</button>'+
            '<button ng-click="cancelPreviewModeStyle()" class="btn x-small-btn">Annuler</button>'+
            '</div>'+
            '<ul class="col col2 colMarge listStyle ul-reset">'+
                '<li ng-repeat="styleSet in listStyleSets">'+
                    '<div class="style_set_container" data-idx="{{$index}}" id="id_{{styleSet.url | encodeUrl}}" ng-class="{active : $index === styleSetSelected}" ng-click="changeStyleSet(styleSet, $index)">'+
                        '{{styleSet.name}}'+
                    '</div>'+
                    '<div ng-if="styleSet.thumbnail !== null && styleSet.thumbnail !== \'\'" class="style_set_thumbnail"><img ng-src="{{styleSet.thumbnail}}" /></div>'+
                '</li>'+
            '</ul>';
        return {
            restrict: 'E',
            template: tplChangeStyleSet,
            require: "^cmAppEditeur",
            link: function(scope, element, attrs, main) {
                $rootScope.styleSetSelected = null;

                /**
                 * Get style set from API
                 */
                apiTplStore.getStyleSets().then(function(result) {
                    scope.listStyleSets = result.data.results;
                    angular.forEach(scope.listStyleSets, function(v, k) {
                        if(!scope.listStyleSets[k].properties.hasOwnProperty("name")) {
                            scope.listStyleSets[k].properties.name = "Style "+(k+1);
                        }
                    });
                });

                /**
                 * @ngdoc function
                 * @name changeStyleSet
                 * @methodOf _directives.directive:cmChangeStyleSet
                 * @param {Object} item style set API object
                 * @param {Number} idx array index
                 * @description
                 * Change the style set and apply it on the template
                 */
                scope.changeStyleSet = function(item, idx) {
                    scope.styleSetSelected = idx;
                    scope.previewModeStyle = true;

                    main.removeStylingElements();
                    main.documentModel.style_set = item.url;
                    main.documentModel.style_set_content = item.content;
                    main.matchColorAndDesc(main.documentModel.color_set_content, item.url);

                    var objectStyleSet = CSSJSON.toJSON(item.content);
                    $rootScope.arrayVarLess = styleSetFct.initArrayCommonLessVariables(objectStyleSet.attributes);
                    $rootScope.styleToEdit = editStyleSetFactory.createArrayTplRules(objectStyleSet.attributes);

                    main.lessTplStyle = main.toothpickLessStyle + $rootScope.globalStyle + item.content;

                    less.render(main.lessTplStyle + main.lessColor, function(e, output) {
                        if(e === null) {
                            $rootScope.styleTpl = output.css;
                        }else {
                            $log.warn("error compilation less colorset");
                            $log.debug(e);
                        }
                    });
                };

                /**
                 * @ngdoc function
                 * @name cancelPreviewModeStyle
                 * @methodOf _directives.directive:cmChangeStyleSet
                 * @description
                 * Reset the style and re-apply saved styleset
                 */
                scope.cancelPreviewModeStyle = function() {
                    scope.previewModeStyle = false;
                    scope.styleSetSelected = $rootScope.originalIndexStyle;
                    main.removeStylingElements();
                    main.documentModel.style_set = $rootScope.savedStyleUrl;
                    main.documentModel.style_set_content = $rootScope.savedStyleContent;
                    if(!_.isNull($rootScope.savedStyleUrl) && !_.isUndefined($rootScope.savedStyleUrl)) {
                        main.matchColorAndDesc(main.documentModel.color_set_content, $rootScope.savedStyleUrl);
                    }else {
                        var colorDesc = editeurService.matchPropertiesAndColor($rootScope.savedColorContent, editeurService.defaultStyleSet.properties);

                        scope.setColors = colorDesc;
                    }
                    var objectStyleSet = CSSJSON.toJSON($rootScope.savedStyleContent);
                    $rootScope.arrayVarLess = styleSetFct.initArrayCommonLessVariables(objectStyleSet.attributes);
                    $rootScope.styleToEdit = editStyleSetFactory.createArrayTplRules(objectStyleSet.attributes);
                    main.lessTplStyle = main.toothpickLessStyle + $rootScope.globalStyle + $rootScope.savedStyleContent;

                    less.render(main.lessTplStyle + main.lessColor, function(e, output) {
                        if(e === null) {
                            $rootScope.styleTpl = output.css;
                        }else {
                            $log.warn("error compilation less colorset");
                            $log.debug(e);
                        }
                    });

                };

                /**
                 * @ngdoc function
                 * @name applyStyle
                 * @methodOf _directives.directive:cmChangeStyleSet
                 * @description
                 * Remove the preview mode
                 */
                scope.applyStyle = function() {
                    scope.previewModeStyle = false;
                };
            }
        };
    };

    module.exports = directive;
}());
