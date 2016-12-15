module.exports = angular.module('toothpaste.tplStore', [])

.factory('apiTplStore', require('internal_components/tpl_store/apiTplStore.factory'))
.directive('cmListTplPreview', require('internal_components/tpl_store/listTplPreview.directive'))
.directive('cmListTpl', require('internal_components/tpl_store/listTpl.directive'));
