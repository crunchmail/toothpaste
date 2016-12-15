module.exports = angular.module('toothpaste.user', [])

.factory('apiUser', require('user/apiUser.factory'))

.directive('cmMenuProfile', require('user/menuProfile.directive'))
.directive('cmProfile', require('user/profile.directive'));
