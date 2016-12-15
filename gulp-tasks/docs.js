var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-if': 'gulpif',
        'gulp-angular-gettext': 'gettext',
        'gulp-tag-version': 'tag_version'
    }
});
var paths = require('../gulp.config.json');

/**
 * Generate a documentation
 */
gulp.task('docs', function () {
    var options = {
        html5Mode: false,
        startPage: '/install'
    };
    return plugins.ngdocs.sections({
        api: {
            glob: [
                paths.internalComponents + '**/*.js',
                paths.docs.api
            ],
            api: true,
            title: 'API Documentation'
        },
        install: {
            glob: paths.docs.install,
            title: "Installation"
        }
    }).pipe(plugins.ngdocs.process(options))
    .pipe(gulp.dest('./docs'));
});
