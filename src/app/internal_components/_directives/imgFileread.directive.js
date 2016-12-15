/**
 * @ngdoc directive
 * @name _directives.directive:cmImgFileread
 * @restrict A
 * @requires _factory.factory:uploadStore
 * @scope
 * @param {Object} fileModel callback function, execute in the promise success
 * @param {Function} callback callback function, execute in the promise success
 * @description
 * On input event change, call a uploadStore function (readFile) to read the file
 */
(function () {
    'use strict';

    var directive = function(_, $log, cmNotify, gettextCatalog, uploadStore) {
        return {
            scope: {
                fileModel: "=",
                callback: "&"
            },
            templateUrl: 'views/_directives/imgFileRead.html',
            link: function (scope, element, attributes) {
                var input = element.find("input");

                input.bind("change", function (changeEvent) {
                    $log.debug("change");
                    uploadStore.readImage(this.files[0], scope.callback);
                });
            }
        };
    };

    module.exports = directive;

}());
