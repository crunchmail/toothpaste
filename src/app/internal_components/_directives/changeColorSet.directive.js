/**
 * @ngdoc directive
 * @name _directives.directive:cmChangeColorSet
 * @restrict E
 * @requires tpl_store.factory:apiTplStore
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires https://docs.angularjs.org/api/ng/service/$timeout
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires editeur.factory:editeurService
 * @requires _factory.factory:cmNotify
 * @requires _factory.factory:base64
 * @requires gettextCatalog
 * @requires moment
 * @requires Lodash
 */
(function () {
  'use strict';
  var directive = function(apiTplStore, $rootScope,
            $timeout, $log, cmNotify, gettextCatalog, base64, _, editeurService, moment) {
      var tplChangeColorSet = '<div ng-show="resetActions" class="btns colorSetBtns">'+
       '<button translate ng-click="resetChangeColor()" class="btn x-small-btn">Reset</button>'+
       '</div>'+
       '<h3>' + gettextCatalog.getString("Generic color sets") + '</h3>'+
       '<ul class="listStyle listColors ul-reset col col2 colMarge">'+
         '<li ng-repeat="colorSet in publicColorSet">'+
           '<div data-idx="{{$index}}" id="id_{{colorSet.url | encodeUrl}}" ng-click="changeColorSet(colorSet)">'+
             '<ul class="ul-reset">'+
               '<li class="colorPreview" ng-repeat="color in colorSet.colors" style="background-color: {{color}}"></li>'+
             '</ul>'+
           '</div>'+
         '</li>'+
       '</ul>'+
       '<div ng-if="privateColorSet.length > 0">'+
         '<h3>' + gettextCatalog.getString("My color sets") + '</h3>'+
         '<ul class="listStyle listColors ul-reset col col2 colMarge">'+
           '<li ng-repeat="colorSet in privateColorSet">'+
             '<div data-idx="{{$index}}" id="id_{{colorSet.url | encodeUrl}}" ng-click="changeColorSet(colorSet)">'+
               '<ul class="ul-reset">'+
                 '<li class="colorPreview" ng-repeat="color in colorSet.colors" style="background-color: {{color}}">'+
                 '</li>'+
               '</ul>'+
             '</div>'+
             '<button cm-confirm="' + gettextCatalog.getString("Are you sure you want to delete this colorset ?") + '" ng-click="deleteColorSet(colorSet, $index)">×</button>'+
           '</li>'+
         '</ul>'+
       '</div>';
    return {
      restrict: 'E',
      template: tplChangeColorSet,
      require: "^cmAppEditeur",
      link: function(scope, element, attrs, main) {
          $rootScope.savedColorContent = null;
          scope.publicColorSet = [];
          scope.privateColorSet = [];

          /**
           * Get all colorsset from API
           */
          apiTplStore.getColorsSets().then(function(result) {
              var allColorSets = result.data.results;

              /*
              * Set Default Colors
              */
              angular.forEach(allColorSets, function(v, k) {
                  if(!allColorSets[k].is_public) {
                      scope.privateColorSet.push(allColorSets[k]);
                  }else {
                      scope.publicColorSet.push(allColorSets[k]);
                  }
              });
          });

          /**
           * Remove active class
           */
          function removeActiveClass() {
              var colorElements = document.querySelectorAll(".listColors .active");
              angular.forEach(colorElements, function(el) {
                  el.classList.remove("active");
              });
          }

          /**
           * @ngdoc function
           * @methodOf _directives.directive:cmChangeColorSet
           * @name changeColorSet
           * @param {Object} item Passing the color set object
           * @description
           * Change the colorSet on the template
           */
          scope.changeColorSet = function(item) {
              /**
               * Remove active class and set active class to the correct color set
               */
              removeActiveClass();
              document.getElementById("id_" + btoa(item.url)).classList.add("active");
              scope.resetActions = true;
              main.removeStylingElements();
              /**
               * Set the color set on documentModel
               */
              main.documentModel.color_set_content = item.colors;
              main.documentModel.color_set = item.url;
              main.documentModel.color_set_is_dirty = true;
              if(!_.isUndefined(main.documentModel.style_set) && !_.isNull(main.documentModel.style_set)) {
                  main.matchColorAndDesc(item.colors, main.documentModel.style_set);
              }else {
                  var colorDesc = editeurService.matchPropertiesAndColor(item.colors, editeurService.defaultStyleSet.properties);

                  scope.setColors = colorDesc;
              }
              scope.saveColorButton = false;
          };

          /**
           * @ngdoc function
           * @methodOf _directives.directive:cmChangeColorSet
           * @name resetChangeColor
           * @description
           * Re-apply the color set saved on the template
           */
          scope.resetChangeColor = function() {
              /**
               * Hide reset button and save colorSet button
               */
              scope.resetActions = false;
              scope.saveColorButton = false;

              main.removeStylingElements();
              removeActiveClass();
              if(!_.isUndefined($rootScope.previousElement)) {
                  $rootScope.previousElement.classList.add("active");
              }
              /**
               * Re-set colorSet with saved colorSet
               */
              main.documentModel.color_set_content = $rootScope.savedColorContent;
              if(!_.isUndefined(main.documentModel.style_set) && !_.isNull(main.documentModel.style_set)) {
                  main.matchColorAndDesc($rootScope.savedColorContent, main.documentModel.style_set);
              }else {
                  var colorDesc = editeurService.matchPropertiesAndColor($rootScope.savedColorContent, editeurService.defaultStyleSet.properties);

                  scope.setColors = colorDesc;
              }

          };

          /**
           * @ngdoc function
           * @methodOf _directives.directive:cmChangeColorSet
           * @name saveColorSet
           * @description
           * Save a new color set
           */
          scope.saveColorSet = function() {
              var objColors = main.returnColorObj(scope.setColors);
              var colorSetToSave = {
                  "name": "colorSet-" + moment().format('YYYY-MM-DD_h:mm:ss'),
                  "colors": objColors,
                  "is_public": false
              };
              apiTplStore.saveColorSet(colorSetToSave).then(function(result) {
                  scope.privateColorSet.push(result.data);
                  //$log.debug(result.data);
                  main.matchColorAndDesc(result.data.colors, main.documentModel.style_set);
                  $rootScope.savedColorContent = result.data.colors;

                  removeActiveClass();

                  main.documentModel.color_set = result.data.url;
                  main.documentModel.color_set_content = result.data.colors;
                  main.documentModel.color_set_is_dirty = true;

                  /*
                  * Wait element pushed on private listing
                  */
                  $timeout(function() {
                      document.getElementById("id_" + base64.encode(result.data.url)).classList.add("active");
                      $rootScope.previousElement = document.getElementById("id_" + base64.encode(result.data.url));
                  });

                  if(scope.isPrivTpl) {
                    //   var tpl = document.querySelector(".crunchGlobalWrapper");
                    //   var privTpl = _.clone(main.documentModel);
                    //   privTpl.content = scope.renderCode;
                    //   editeurService.screenshot(tpl, function(data) {
                    //       privTpl.thumbnail = data.file;
                    //       apiTplStore.updateTpl(privTpl.url, privTpl).then(function(response) {
                    //           cmNotify.message(gettextCatalog.getString('Template updated'), 'success');
                    //       });
                    //   });
                  }

                  /*
                  * Hide btns save and reset
                  */
                  scope.saveColorButton = false;
                  scope.resetActions = false;

                  cmNotify.message(gettextCatalog.getString("Color Set created"), "success");
              });
          };

          /**
           * @ngdoc function
           * @methodOf _directives.directive:cmChangeColorSet
           * @name deleteColorSet
           * @param {Object} colorSet Passing the color set object from API
           * @param {Number} idx Array index to remove element
           * @description
           * Delete colorSet in API and array with others color set
           */
          scope.deleteColorSet = function(colorSet, idx) {
              apiTplStore.deleteColorSet(colorSet.url).then(function() {
                  scope.privateColorSet.splice(idx, 1);
                  cmNotify.message(gettextCatalog.getString("Color Set deleted"), "success");
              },function() {
                  cmNotify.message(gettextCatalog.getString("Color Set not deleted"), "error");
              });
          };

      }
     };
  };

  module.exports = directive;
}());
