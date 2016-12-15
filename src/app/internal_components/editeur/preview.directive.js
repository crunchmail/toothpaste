/**
 * @ngdoc directive
 * @name editeur.directive:cmPreview
 * @restrict E
 * @description
 * Create a dialog with mobile, tablet and desktop preview
 * @scope
 * @param {Object} html Template html
 */
(function () {
    'use strict';
    var directive = function() {
        return {
            restrict: 'E',
            scope: {
                'html': "="
            },
            templateUrl: "views/editeur/_preview.html",
            controller: function($scope) {
                /*
                 * Init size support iframe
                   TODO add a RWD handler
                 */
                $scope.support = "size-desktop";
                $scope.iframeHtml = $scope.html;

                /**
                 * @ngdoc function
                 * @name changeSupport
                 * @methodOf editeur.directive:cmPreview
                 * @description
                 * Change the preview mobile, tablet or desktop
                 */
                $scope.changeSupport = function(e, support) {
                    $scope.support = support;
                    var disabledBtns = document.querySelectorAll(".disabled-btn");
                    for(var b = 0; b < disabledBtns.length; b++) {
                        disabledBtns[b].classList.remove("disabled-btn");
                    }
                    angular.element(e.target).addClass("disabled-btn");
                };
            }
        };
    };
    module.exports = directive;
}());
