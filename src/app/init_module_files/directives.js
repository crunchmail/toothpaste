module.exports = angular.module('toothpaste.directives', [])

/*
 * Commons
 */
.directive('cmDropDown', require('_directives/dropDown.directive'))
.directive('cmCollapse', require('_directives/collapse.directive'))
.directive('cmDynamic', require('_directives/dynamic.directive'))
.directive('cmConfirm', require('_directives/confirm.directive'))

/*
 * Specific Toothpaste
 */
.directive('cmImgFileread', require('internal_components/_directives/imgFileread.directive'))
.directive('cmFilereader', require('internal_components/_directives/fileReader.directive'))
.directive('cmChangeStyleSet', require('internal_components/_directives/changeStyleSet.directive'))
.directive('cmChangeColorSet', require('internal_components/_directives/changeColorSet.directive'));
