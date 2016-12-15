/**
 * @ngdoc directive
 * @name editeur.directive:cmDialogNamePrivTpl
 * @restrict E
 * @description
 * Display a dialog to set a name to the private template
 */
(function () {
    'use strict';
    var directive = function() {
        return {
            restrict: 'E',
            templateUrl: "views/editeur/_dialogNamePrivTpl.html",
            controller: function($scope) {
                /**
                 * @ngdoc function
                 * @name createName
                 * @methodOf editeur.directive:cmDialogNamePrivTpl
                 * @description
                 * Return the success promise with the private name
                 */
                $scope.createName = function() {
                    $scope.confirm($scope.name);
                };
            }
        };
    };
    module.exports = directive;
}());
