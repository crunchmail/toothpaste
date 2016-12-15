/**
 * @ngdoc directive
 * @name editeur.directive:cmCheckIe
 * @restrict A
 * @requires https://docs.angularjs.org/api/ng/service/$timeout
 * @description
 * Calculate the column width for outlook
 */
(function () {
    'use strict';

    var directive = function($timeout) {
        return {
            restrict: "A",
            link: function(scope, element, attrs, main) {

                /*
                 * Access element
                 */
                var el = scope.$eval(attrs.checkIeEl);
                var idx = scope.$eval(attrs.checkIndex);
                var widthTable = el.widthTable;
                var widthCalculate = widthTable;
                var col = el.columns;
                /*
                 * Wait content load
                   TODO Review this
                 */
                $timeout(function() {
                    var elWidth = element[0].offsetWidth;

                    /*
                     * Add new property width on element
                       TODO Review this
                     */
                    element[0].style.width = elWidth;
                    col[idx].width = elWidth;
                    for(var c = 0; c < col.length - 1; c++) {
                        widthCalculate = widthCalculate - col[c].width;
                    }

                    col[col.length - 1].width = widthCalculate;
                }, 2000);

            }
        };
    };

    module.exports = directive;

}());
