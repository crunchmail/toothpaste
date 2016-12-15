var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-if': 'gulpif',
        'gulp-angular-gettext': 'gettext',
        'gulp-tag-version': 'tag_version'
    }
});
var semver = require('semver');

function bump(importance) {
    var version = semver.inc(require('./package.json').version, importance);

    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
        .pipe(plugins.bump({type: importance}))
        .pipe(gulp.dest('./'))
        .pipe(plugins.git.commit('bump version '+version))
        .pipe(plugins.filter('package.json'))
        .pipe(plugins.tag_version({prefix: ''}));
}

gulp.task('patch', function() { return bump('patch'); });
gulp.task('minor', function() { return bump('minor'); });
gulp.task('major', function() { return bump('major'); });
