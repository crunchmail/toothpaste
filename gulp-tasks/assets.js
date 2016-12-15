var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-if': 'gulpif',
        'gulp-angular-gettext': 'gettext',
        'gulp-tag-version': 'tag_version'
    }
});
var merge = require('merge-stream');
var paths = require('../gulp.config.json');
var argv = require('yargs')
.default('env', 'local')
.default('config', '')
.argv;
var dist = paths.dist + argv.env + '/';
var prod = argv.env == 'prod' ? true : false;

gulp.task('assets', function() {
    var css = gulp.src(paths.extLibsCss)
    .pipe(plugins.concat('libs-css.min.css'))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest(dist + 'css/lib'));

    gulp.src(paths.intLibsCss)
    .pipe(gulp.dest(dist + 'css/lib'));

    var less = gulp.src(paths.lessFiles + 'main.less')
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.minifyCss())
    .pipe(plugins.concat('styles.min.css'))
    .pipe(gulp.dest(dist + 'css'));

    var images = gulp.src(paths.frontendAssets + 'img/**/*')
    .pipe(gulp.dest(dist + 'css/img/'));

    var fonts = gulp.src(paths.frontendAssets + 'fonts/*')
    .pipe(gulp.dest(dist + 'css/fonts'));

    var other = gulp.src('src/static/*')
    .pipe(gulp.dest(dist));

    return merge(css, less, images, fonts, other);
});

gulp.task('bowerJsComponents', function() {
    var jsComponents = paths.extLibsJs;

    if(argv.env !== "prod") {
        jsComponents.push('node_modules/angular-mocks/angular-mocks.js');
    }

    gulp.src(jsComponents)
    .pipe(plugins.concat('libs-js.min.js'))
    .pipe(plugins.uglify({
        mangle: false
    }))
    .pipe(gulp.dest(dist + 'js'));
});
