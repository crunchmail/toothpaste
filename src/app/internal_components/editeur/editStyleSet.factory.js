/**
 * @ngdoc service
 * @name editeur.factory:editStyleSetFactory
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires Lodash
 * @requires editeur.factory:styleSetFct
 * @description
 * Style set utils function
 */
(function () {
    'use strict';

    var factory = function(styleSetFct, $log, _, $rootScope) {
        return {
            /**
             * @ngdoc function
             * @methodOf editeur.factory:editStyleSetFactory
             * @name createRegexp
             * @description
             * Create a regexp to search in less file correct value
             * @param {String} lessVal Variable less to search
             * @param {String} val Value
             */
            createRegexp: function(lessVal, val) {
                if(_.isNumber(val)) {
                    val = "[0-9]*";
                }
                var regexp = new RegExp(lessVal + ":\\s?" + val, "g");

                return regexp;
            },
            /**
             * @ngdoc function
             * @methodOf editeur.factory:editStyleSetFactory
             * @name applyStyleSet
             * @description
             * Apply style set
             * @param {String} regexp Regular expression
             * @param {String} expression Expression to replace
             * @param {Object} ctrl Passing controller
             */
            applyStyleSet: function(regexp, expression, ctrl) {
                if(!_.isNull(ctrl.lessTplStyle)) {
                    ctrl.lessTplStyle = ctrl.lessTplStyle.replace(regexp, expression);
                    less.render(ctrl.lessTplStyle + ctrl.lessColor, function(e, output) {
                        if(e === null) {
                            $rootScope.styleTpl = output.css;
                        }else {
                            $log.warn("error compilation less");
                            $log.debug(e);
                        }
                    });
                }
            },
            /**
             * @ngdoc function
             * @methodOf editeur.factory:editStyleSetFactory
             * @name createObjTplRule
             * @description
             * Return a object with correct parameters to setup live modification for the the style set
             * @param {String} key Object key
             * @param {String} value Object value
             * @param {String} nameObj The object name
             * @param {Object} data Passing data to extract rule to apply on the template
             */
            createObjTplRule: function(key, value, nameObj, data) {
                var obj = {};
                obj.regexp = key;
                obj.initValue = parseFloat(value);
                /*
                 * get less variables name to catch properties
                 */
                 _.forOwn(data, function(v, k) {
                     var regexpNameProperty = new RegExp("(@_+)(" + nameObj + "_)([A-Za-z]*_?[A-Za-z]*)", "g");
                     if(k.match(regexpNameProperty)) {
                         var nameProperty = regexpNameProperty.exec(k);
                         obj[nameProperty[3]] = angular.fromJson(v);
                     }
                 });


                 //obj[nameProperty[3]] = v;

                return obj;
            },
            /**
             * @ngdoc function
             * @methodOf editeur.factory:editStyleSetFactory
             * @name createArrayTplRules
             * @description
             * Return a array with createObjTplRule function
             * @param {Array} data Passing data to extract rule to apply on the template
             */
            createArrayTplRules: function(data) {
                var arr = [];
                var that = this;
                _.forOwn(data, function(v, k) {
                    var regexpProperty = /(@_+)([A-Za-z]*)/g;
                    if(!k.match(regexpProperty) && !_.has(styleSetFct.arrayCommonLessVariables, k)) {
                        var nameObj = k.split("@");

                        arr.push(that.createObjTplRule(k, v, nameObj[1], data));
                    }
                });

                return arr;
            }
        };
    };
    module.exports = factory;
}());
