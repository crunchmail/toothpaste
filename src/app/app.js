(function () {
    'use strict';
    /*
     * Commons
     */
    require('init_libraries');

    /*
     * Specific for Toothpaste
     */
    require('angular-sanitize');
    require('angularjs-color-picker/dist/angularjs-color-picker');
    require('angular-ui-codemirror/ui-codemirror');
    //require('less/dist/less.min');

    //Global directives & Factory
    require('./init_module_files/factory');
    require('./init_module_files/directives');

    //Load modules
    require('./init_module_files/tplStore');
    require('./init_module_files/user');
    require('./init_module_files/editeur');
    require('./init_module_files/message');
    require('./init_module_files/importHtml');
    require('./init_module_files/toothwys');
    require('./config/config');

    //init module angular
    var toothpaste = angular.module('toothpaste', [
        'external-libraries',
        'color.picker',
        'ngSanitize',
        'ui.codemirror',
        'appConfig',
        'toothpaste.directives',
        'toothpaste.factory',
        'toothpaste.message',
        'toothpaste.importHtml',
        'toothpaste.tplStore',
        'toothpaste.user',
        'toothpaste.editeur',
        'toothpaste.toothwys'
    ])
    .directive('placeholder', require('_directives/placeholder.directive'));

    //Config route
    toothpaste.config(require('./routes'));

    toothpaste.config(function($logProvider, appSettings) {
        if(appSettings.debug) {
            $logProvider.debugEnabled(true);
        }else {
            $logProvider.debugEnabled(false);
        }
    });



    toothpaste.run(require('./on_run'));

    //Filter in template to encode url
    toothpaste.filter('encodeUrl', function() {
        return window.btoa;
    });


}());
