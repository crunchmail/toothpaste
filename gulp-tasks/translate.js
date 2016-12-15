var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-if': 'gulpif',
        'gulp-angular-gettext': 'gettext',
        'gulp-tag-version': 'tag_version'
    }
});
var paths = require('../gulp.config.json');

var argv = require('yargs')
.default('env', 'local')
.default('config', '')
.argv;

var dist = paths.dist + argv.env + '/';

/**
 * Generate .pot files for translation
 */
gulp.task('gettext', function () {
    return gulp.src([
            paths.internalComponents + '**/*.html',
            paths.internalComponents + '**/*.js'])
        .pipe(plugins.gettext.extract('toothpaste.pot', {
            attributes: ['placeholder', 'cm-confirm']
        }))
        .pipe(gulp.dest(paths.internalComponents + 'lang/'));
});

// Build translations
gulp.task('translations', function () {
    return gulp.src([
        paths.internalComponents + 'lang/**/*.po',
        paths.frontendDirectives + 'lang/**/*.po'
    ])
    .pipe(plugins.gettext.compile({
        format: 'json'
    }))
    .pipe(gulp.dest(dist + 'lang/'));
});
