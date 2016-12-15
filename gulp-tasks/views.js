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

gulp.task('views', function() {
    return gulp.src([
        paths.frontendDirectives + '**/*.html',
        paths.internalComponents + '**/*.html'
    ])
    .pipe(gulp.dest(dist + 'views/'));
});
