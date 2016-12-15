(function () {
    'use strict';


    var Routes = function($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/tpl_store/_list_tpl.layout.html',
            bodyClass: 'container-full'
        })
        .when('/editeur/:url/:type?', {
            templateUrl: 'views/editeur/_editeur.layout.html'
        })
        .when('/import-html/:urlMessage?', {
            templateUrl: 'views/importHtml/importHtml.layout.html',
            bodyClass: 'removeMargeContainer overflowHideBody'
        })
        .otherwise({
            redirectTo: '/'
        });

    };

    module.exports = Routes;
}());
