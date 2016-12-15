(function () {
    'use strict';

    var appSettings = {
        apiUrl : 'http://127.0.0.1.8000',
        version: 'v1',
        source: "Toothpaste",
        apiKey: "",
        pubTemplates:[],
        privTemplates:[],
        nameTemp:"",
        debug: false,
        urlMessage: "",
        raven: {
            dsn: ''
        },
        lang: {
            default: 'fr',
            // allow to see missing translations
            debug: false,
            // default is "[MISSING]:"
            debugPrefix: '¬ '
        },
        config: {
            release: 'VERSION',
            tags: {
                git_commit: 'COMMIT',
                env: 'ENVIRONMENT'
            }
        }
    };

    module.exports = appSettings;
}());
