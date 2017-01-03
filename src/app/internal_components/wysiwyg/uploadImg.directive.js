/**
 * @ngdoc directive
 * @name wysiwyg.directive:cmUploadImg
 * @restrict E
 * @requires https://docs.angularjs.org/api/ng/service/$log
 * @requires https://docs.angularjs.org/api/ng/service/$timeout
 * @requires _factory.factory:uploadStore
 * @requires wysiwyg.factory:wysService
 * @requires Lodash
 * @description
 * Upload a image and modify image properties
 * @scope
 * @param {Node} el Passing element to modify
 * @param {Node} parentEl Passing parent element to modify
 */
(function () {
    'use strict';
    var directive = function($log, uploadStore, $timeout, _, wysService) {
        var tplUploadImg = "<div class=\"form-wysiwyg formUpload\" name=\"formUpload\" novalidate>"+
            "<div class=\"form-group\">"+
                "<cm-img-fileread file-model=\"formImg.file\" callback=\"uploadImg(file)\"></cm-img-fileread>"+
            "</div>"+
            "<div class=\"form-group imgLinkForm\">"+
                "<label translate>Add link</label>"+
                "<button ng-disabled=\"disabledLinkImg\" class=\"x-small-btn btn\" ng-click=\"removeLinkAttr()\">×</button>"+
                "<input name=\"link\" ng-model=\"formImg.link\" type=\"url\" />"+
                "<button ng-disabled=\"formImg.link === 'http://'\" class=\"x-small-btn btn\" ng-click=\"addLinkImage()\">OK</button>"+
                "<div ng-show=\"linkAdded\" class=\"description\" translate>The link was added</div>"+
                "<div ng-show=\"linkRemoved\" class=\"description\" translate>The link was removed</div>"+
            "</div>"+
            "<div class=\"form-group imgLinkForm\">"+
                "<label translate>Add image description</label>"+
                "<button ng-disabled=\"disabledAltImg\" class=\"x-small-btn btn\" ng-click=\"removeAltAttr()\">×</button>"+
                "<input name=\"alt\" ng-model=\"formImg.alt\" type=\"text\" />"+
                "<button ng-disabled=\"formImg.alt === ''\" class=\"x-small-btn btn\" ng-click=\"addAltImage()\">OK</button>"+
                "<div ng-show=\"altAdded\" class=\"description\" translate>The description was added</div>"+
                "<div ng-show=\"altRemoved\" class=\"description\" translate>The description was removed</div>"+
            "</div>"+
            "<div class=\"rangeImgSizeUpload form-group\">"+
                "<label translate for=\"\">Image width</label>"+
                "<input max=\"{{maxValueRange}}\" min=\"20\" step=\"10\" type=\"range\" ng-model=\"widthImgTpl\" ng-change=\"changeSizeImage()\"/>"+
                "<span class=\"valueRange\">{{widthImgTpl}}</span>"+
            "</div>"+
        "</div>";
        return {
            restrict: 'E',
            template: tplUploadImg,
            scope: {
                "el":"=",
                "parentEl":"="
            },
            require: '^cmAppEditeur',
            controller: function($scope) {
                var parent = wysService.getParentByTagName($scope.el[0], "div");
                $scope.maxValueRange = parent.offsetWidth;
                $scope.formImg = {
                    "disabled": true,
                    "width": 0,
                    "alt": ""
                };
                $scope.disabledLinkImg = true;
                $scope.disabledAltImg = true;
                var vm = this;

                this.getForm = function() {
                    return $scope.formImg;
                };
                this.getElement = function() {
                    return $scope.el;
                };
            },
            link: function(scope, element, attrs, ctrl) {
                var elementImg = scope.el.find('img');
                var existLink = scope.el.find('img').parent();
                if(existLink[0].tagName === "A") {
                    scope.formImg.link = existLink.attr("href");
                    scope.disabledLinkImg = false;
                }else {
                    scope.formImg.link = "http://";
                }
                scope.widthImgTpl = elementImg[0].width;

                /**
                 * @ngdoc function
                 * @name uploadImg
                 * @methodOf wysiwyg.directive:cmUploadImg
                 * @param {File} file input file value
                 * @description
                 * Post an image to API
                 */
                scope.uploadImg = function(file) {
                    $log.debug("uploadImg");
                    uploadStore.postFile(file, ctrl.documentModel.url, "image").then(function(data) {
                        var elementImg = scope.el.find('img');
                        elementImg[0].setAttribute('src', data.file);
                        /*
                         * Remove attr width of the previous img
                         */
                        elementImg[0].removeAttribute('style');
                        if(!_.isUndefined(scope.parentEl)) {
                            /*
                             * Update Object
                             */
                            scope.parentEl.html = scope.el[0].innerHTML;
                            /*
                             * Set new with for the range input
                             */
                            scope.widthImgTpl = data.details.width;
                        }
                        ctrl.documentModel.isDirty = true;
                    });
                };

                /**
                 * @ngdoc function
                 * @name addLinkImage
                 * @methodOf wysiwyg.directive:cmUploadImg
                 * @description
                 * Add a link on image
                 */
                scope.addLinkImage = function() {
                    var checkIfLink = scope.el.find('img').parent();
                    if(checkIfLink[0].tagName === "A") {
                        checkIfLink.attr("href", scope.formImg.link);
                        /*
                         * Active button reset
                         */
                        scope.disabledLinkImg = false;
                    }else {
                        scope.el[0].innerHTML = '<a href="' + scope.formImg.link + '">' + scope.el.find('img')[0].outerHTML + '</a>';
                        /*
                         * Active button reset
                         */
                        scope.disabledLinkImg = false;
                        /*
                         * Show user message
                         */
                        scope.linkAdded = true;
                        $timeout(function() {
                            scope.linkAdded = false;
                        }, 2000);
                    }

                    if(!_.isUndefined(scope.parentEl)) {
                        scope.parentEl.html = scope.el[0].innerHTML;
                    }
                };

                /**
                 * @ngdoc function
                 * @name addAltImage
                 * @methodOf wysiwyg.directive:cmUploadImg
                 * @description
                 * Add a description alt on image
                 */
                scope.addAltImage = function() {
                    scope.el.find('img').attr("alt", scope.formImg.alt);
                    if(!_.isUndefined(scope.parentEl)) {
                        scope.parentEl.html = scope.el[0].innerHTML;
                    }
                    /*
                     * Active button reset
                     */
                    scope.disabledAltImg = false;
                    /*
                     * Show user message
                     */
                    scope.altAdded = true;
                    $timeout(function() {
                        scope.altAdded = false;
                    }, 2000);
                };

                /**
                 * @ngdoc function
                 * @name removeLinkAttr
                 * @methodOf wysiwyg.directive:cmUploadImg
                 * @description
                 * Remove link image
                 */
                scope.removeLinkAttr = function() {
                    scope.el.find("a").replaceWith(function() {
                        return angular.element("img", this);
                    });
                    scope.parentEl.html = scope.el.find('img')[0].outerHTML;
                    scope.disabledLinkImg = "true";
                    scope.linkRemoved = true;
                    scope.formImg.link = "http://";
                    $timeout(function() {
                        scope.linkRemoved = false;
                    }, 2000);
                };

                /**
                 * @ngdoc function
                 * @name removeAltAttr
                 * @methodOf wysiwyg.directive:cmUploadImg
                 * @description
                 * Remove description alt on image
                 */
                scope.removeAltAttr = function() {
                    scope.el.find('img').attr("alt", "");
                    if(!_.isUndefined(scope.parentEl)) {
                        scope.parentEl.html = scope.el[0].innerHTML;
                    }
                    scope.disabledAltImg = "true";
                    scope.altRemoved = true;
                    scope.formImg.alt = "";
                    $timeout(function() {
                        scope.altRemoved = false;
                    }, 2000);
                };

                /**
                 * @ngdoc function
                 * @name changeSizeImage
                 * @methodOf wysiwyg.directive:cmUploadImg
                 * @description
                 * Change the image width
                 */
                scope.changeSizeImage = function() {
                    scope.el.find("img")[0].style.width = scope.widthImgTpl + "px";
                    elementImg[0].style.width = scope.widthImgTpl + "px";
                    if(!_.isUndefined(scope.parentEl)) {
                        scope.parentEl.html = scope.el[0].innerHTML;
                    }
                };
            }
        };
    };

    module.exports = directive;
}());
