(function () {
    'use strict';

    var appSettings = {
        apiUrl : 'https://api.munch/',
        version: 'v1',
        source: "Toothpaste",
        apiKey: "666friGftImOjwPe3wPBNntLj6hcZG",
        pubTemplates: [],
        privTemplates: [],
        nameTemp: "debugName",
        debug: true,
        urlMessage: "",
        raven: {
            dsn: ''
        },
        lang: {
            default: 'fr',
            // allow to see missing translations
            debug: true,
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
