/**
 * @ngdoc service
 * @name editeur.factory:styleSetFct
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires Lodash
 * @description
 * Utils function for style set
 */
(function () {
    'use strict';

    var factory = function($rootScope, $log, _) {
        return {
            arrayCommonLessVariables: {},
            arrayCustomLessVariables: {},
            toothpickLessStyle: "",
            toothpickCssStyle: "",
            /**
             * @ngdoc function
             * @name createArrayCommonLessVariables
             * @methodOf editeur.factory:styleSetFct
             * @description
             * Create a array with less variables
             * @param {Object} lessVariables Passing less variables
             */
            createArrayCommonLessVariables: function(lessVariables) {
                var arr = {};
                var hexRegExp = new RegExp("\s?#[0-9]*", 'g');
                _.forOwn(lessVariables, function(v, k) {
                    if(!hexRegExp.test(v)) {
                        if(_.isNaN(parseFloat(v))) {
                            /*
                             * remove first space into string value
                             */
                            var value = v;
                            if(typeof v === "object") {
                                value = v[1];
                            }
                            arr[k] = value.replace(/\s?/, '');
                        }else {
                             arr[k] = parseFloat(v);
                        }
                    }
                });
                return arr;
            },
            /**
             * @ngdoc function
             * @name initArrayCommonLessVariables
             * @methodOf editeur.factory:styleSetFct
             * @description
             * Init an array with less variables
             * @param {Object} lessVariables Passing less variables
             */
            initArrayCommonLessVariables: function(lessVariables) {
                var cloneOldArr = _.clone(this.arrayCommonLessVariables);
                var newArr = this.createArrayCommonLessVariables(lessVariables);
                var customLessVariables = {};
                var lessVariablesToMerge = {};

                _.forOwn(newArr, function(v, k) {
                    if(!_.has(cloneOldArr, k)) {
                        customLessVariables[k] = v;
                    }else {
                        lessVariablesToMerge[k] = v;
                    }
                });

                var arrMerged = _.merge(cloneOldArr, lessVariablesToMerge);
                this.arrayCustomLessVariables = this.createArrayCommonLessVariables(customLessVariables);

                return this.createArrayCommonLessVariables(_.merge(arrMerged, this.arrayCustomLessVariables));
            },
            /**
             * @ngdoc function
             * @name createVariablesLess
             * @methodOf editeur.factory:styleSetFct
             * @description
             * Convert API color set to less variables
             * @param {Object} colors Passing color set
             */
            createVariablesLess: function(colors) {
                /*
                 * Create variables less with colors data
                 */
                var lessVariables = "";
                _.forOwn(colors, function(v, k) {
                    lessVariables += '@'+ k + ":" + v + ";";
                });
                return lessVariables;
            },
            /**
             * @ngdoc function
             * @name getLessVariables
             * @methodOf editeur.factory:styleSetFct
             * @description
             * Return an array with less variables to array format
             * @param {Object} colors Passing color set
             */
            getLessVariables: function(colors) {
                var arr = [];

                _.forOwn(colors, function(v, k) {
                    arr['@'+k] = v.color;
                });

                return arr;
            },
            /**
             * @ngdoc function
             * @name stringifyVariablesLess
             * @methodOf editeur.factory:styleSetFct
             * @description
             * Return a string with less variables
             * @param {Object} colors Passing color set
             */
            stringifyVariablesLess: function(colors) {
                /*
                 * Create variables less with colors data
                 */
                var lessVariables = "";
                _.forOwn(colors, function(v, k) {
                    lessVariables += k + ":" + v + ";" + "\n";
                });
                return lessVariables;
            }
        };
    };

    module.exports = factory;
}());
