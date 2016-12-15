/**
 * @ngdoc directive
 * @name editeur.directive:cmIframePreview
 * @restrict E
 * @description
 * Create a iframe with the template html
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @scope
 * @param {Object} cmIframePreview Iframe html
 */
(function () {
    'use strict';
    var directive = function($log) {
        return {
            restrict: 'A',
            scope: {
                'cmIframePreview': "="
            },
            link: function(scope, element, attrs) {
                var doc;

                if (element[0].contentDocument) {
                    doc = element[0].contentDocument;
                }
                else if (element[0].contentWindow) {
                    doc = element[0].contentWindow.document;
                }

                if (doc){
                    // Put the content in the iframe
                    doc.open();
                    doc.writeln(scope.cmIframePreview);
                    doc.close();
                } else {
                    //just in case of browsers that don't support the above 3 properties.
                    //fortunately we don't come across such case so far.
                    $log.warn('Cannot inject dynamic contents into iframe.');
                }
            }
        };
    };
    module.exports = directive;
}());
