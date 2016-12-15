/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmImgHandler
 * @restrict E
 * @requires _factory.factory:uploadStore
 * @requires _factory.factory:cmNotify
 * @requires gettextCatalog
 * @requires Lodash
 * @description
 * Upload a image on drop event
 */
(function () {
    'use strict';
    var directive = function(_, uploadStore, cmNotify, gettextCatalog) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var width = element[0].offsetWidth;
                element.on("drop", function(e) {
                    /*
                     * Prevent open image
                     */
                    e.preventDefault();
                    e.stopPropagation();
                    var file = e.dataTransfer.files[0];
                    var checkIfImg = /image.*/;

                    /*
                     * Check if upload is image
                     */
                    if(!_.isUndefined(file) && checkIfImg.test(file.type)) {
                        uploadStore.postFile(file, width, "image").then(function(data) {
                            element.attr("src", data.file);
                        });
                    }else {
                        cmNotify.message(gettextCatalog.getString("Please upload an image. Other file types are not supported."), "error");
                    }
                });
            }
        };
    };
    module.exports = directive;
}());
