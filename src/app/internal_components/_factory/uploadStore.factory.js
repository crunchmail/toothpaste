/**
 * @ngdoc service
 * @name _factory.factory:uploadStore
 * @requires https://docs.angularjs.org/api/ng/service/$http
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope
 * @requires gettextCatalog
 * @requires moment
 * @requires Lodash
 * @description
 * Utils function for upload store
 */
(function () {
    'use strict';

    var factory = function($http, $log, $rootScope, gettextCatalog, _, moment) {
        return {
            /**
             * @ngdoc function
             * @name dataURItoBlob
             * @param {Object} dataURI passing a Uniform Resource Identifier data
             * @methodOf _factory.factory:uploadStore
             * @description
             * Convert a Uniform Resource Identifier data to a blob object (Binary Large OBject)
             */
            dataURItoBlob: function(dataURI) {
                var byteString;
                if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
                else
                byteString = unescape(dataURI.split(',')[1]);

                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                // write the bytes of the string to a typed array
                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ia], {type:mimeString});
            },
            /**
             * @ngdoc function
             * @name postFile
             * @param {File} file Passing a file input
             * @param {String} docUrl API url
             * @param {String} type file type
             * @methodOf _factory.factory:uploadStore
             * @description
             * Post a file in API
             */
            postFile: function(file, docUrl, type) {
                $log.debug(file);
                /*
                 * Show spinner
                 */
                $rootScope.spinnerVisible = true;
                /*
                 * Create a FormData to send
                 */
                var fd = new FormData();
                fd.append("file", file);
                fd.append("document", docUrl);
                fd.append("kind", type);
                $log.debug(fd);
                return $http.post($rootScope.docFiles, fd, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function(result) {
                    /*
                     * hide Spinner
                     */
                    return result.data;
                }, function(error) {
                    $log.warn(error);
                });
            },
            /**
             * @ngdoc function
             * @name postThumbnail
             * @param {File} file Passing a file input
             * @param {String} docUrl API url
             * @methodOf _factory.factory:uploadStore
             * @description
             * Post a template thumbnail
             */
            postThumbnail: function(file, docUrl) {
                $rootScope.spinnerVisible = true;
                /*
                 * Create a FormData to send
                 */
                var fd = new FormData();
                fd.append("file", file, "thumbnail-"+ moment().format('DD_MM_YYYY_HH_mm_ss') +".png");
                fd.append("document", docUrl);

                return $http.post($rootScope.docThumbnails, fd, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function(result) {
                    /*
                     * hide Spinner
                     */
                    return result.data;
                }, function(error) {
                    $log.warn(error);
                });
            },
            /**
             * @ngdoc function
             * @name readImage
             * @param {File} file Passing a file input
             * @param {Function} callback a callback function
             * @methodOf _factory.factory:uploadStore
             * @description
             * Read a image and return a object file with callback function
             */
            readImage: function(file, callback) {
                window.URL    = window.URL || window.webkitURL;
                var useBlob   = false && window.URL; // `true` to use Blob instead of Data-URL
                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    var image  = new Image();
                    image.addEventListener("load", function () {
                        /*var imageInfo = file.name    +' '+
                                        image.width  +'×'+
                                        image.height +' '+
                                        file.type    +' '+
                                        Math.round(file.size/1024) +'KB';*/
                        if(file.size < 5000000) {
                            callback({file: file});
                        }else {
                            cmNotify.message(gettextCatalog.getString("Your image is too large"), "error");
                        }
                    });
                    image.src = useBlob ? window.URL.createObjectURL(file) : reader.result;
                    if (useBlob) {
                        window.URL.revokeObjectURL(file); // Free memory
                    }
                });
                if(!_.isUndefined(file)) {
                    reader.readAsDataURL(file);
                }
            },
            /**
             * @ngdoc function
             * @name readFile
             * @param {File} file Passing a file input
             * @param {Function} callback a callback function
             * @methodOf _factory.factory:uploadStore
             * @description
             * Read a file and return a object file with callback function
             */
            readFile: function(file, callback) {
                $log.debug(file);
                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    if(file.size < 5000000) {
                        callback({file: file});
                    }else {
                        cmNotify.message(gettextCatalog.getString("Your file is too large"), "error");
                    }
                });
                if(!_.isUndefined(file)) {
                    reader.readAsDataURL(file);
                }
            }
        };
    };

    module.exports = factory;
}());
