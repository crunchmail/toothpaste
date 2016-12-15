module.exports = angular.module('toothpaste.editeur', [])

.factory('styleSetFct', require('internal_components/editeur/styleSetFct.factory'))
.factory('editeurService', require('internal_components/editeur/editeurService.factory'))
.factory('blockFactory', require('internal_components/editeur/blockFactory.factory'))
.factory('editStyleSetFactory', require('internal_components/editeur/editStyleSet.factory'))

.directive('cmContainerDragDrop', require('internal_components/editeur/containerDragDrop.directive'))
.directive('cmPreview', require('internal_components/editeur/preview.directive'))
.directive('cmDialogNamePrivTpl', require('internal_components/editeur/dialogNamePrivTpl.directive'))
.directive('cmCheckIe', require('internal_components/editeur/checkIe.directive'))
.directive('cmEditStyleSet', require('internal_components/editeur/editStyleSet.directive'))
.directive('cmEditStyleSetRange', require('internal_components/editeur/editStyleSetRange.directive'))
.directive('cmEditStyleSetSelect', require('internal_components/editeur/editStyleSetSelect.directive'))
.directive('cmIframePreview', require('internal_components/editeur/iframePreview.directive'))
.directive('cmAppEditeur', require('internal_components/editeur/appEditeur.directive'));
