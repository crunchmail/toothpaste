// Karma configuration
// Generated on Tue Dec 01 2015 16:57:37 GMT+0100 (CET)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'browserify'],


        // list of files / patterns to load in the browser
        files: [
            // load app
            'src/app/app.js',
            // 'src/app/**/*.html',
            // load languages file built
            //'src/public/lang/**/*.json',
            // load angular-mock, use in testing
            'node_modules/angular-mocks/angular-mocks.js',
            // and load test files
            'tests/unit/**/*.test.js'
        ],


        // list of files to exclude
        exclude: [
        ],

        browserify: {
            watch: true,
            paths: ['./node_modules/', 'src/components/', 'src/app/', 'src/components/frontend-directives/'],
            transform: ['debowerify'],
            debug: true
        },

        ngHtml2JsPreprocessor: {
            // If your build process changes the path to your templates,
            // use stripPrefix and prependPrefix to adjust it.
            stripPrefix: 'src/app/',
            prependPrefix: './views/',

            // cacheIdFromPath: function(filepath) {
            //     // example strips 'public/' from anywhere in the path
            //     // module(app/templates/template.html) => app/public/templates/template.html
            //     var cacheId = filepath.strip('public/', '');
            //     return cacheId;
            // },

        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // 'src/components/frontend-directives/init_libraries.js': ['browserify'],
            // 'src/components/frontend-directives/**/*.js': ['browserify'],
            'src/app/app.js': ['browserify'],
            '**/*.html': ['ng-html2js']
            //'external_src/public/lang/**/*.json': ['html2js']
        },




        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultanous
        concurrency: Infinity
    });
};
