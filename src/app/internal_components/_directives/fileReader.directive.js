/**
 * @ngdoc directive
 * @name _directives.directive:cmFileReader
 * @restrict A
 * @requires _factory.factory:uploadStore
 * @scope
 * @param {Function} callbackFile callback function, execute in the promise success
 * @description
 * On input event change, call a uploadStore function (readFile) to read the file
 */
(function () {
    'use strict';

    var directive = function(uploadStore) {
        return {
            scope: {
                callbackFile: "&"
            },
            templateUrl: 'views/_directives/fileReader.html',
            link: function (scope, element, attributes) {
                var input = element.find("input");
                input.bind("change", function (changeEvent) {
                    uploadStore.readFile(this.files[0], scope.callbackFile);
                });
            }
        };
    };

    module.exports = directive;

}());
