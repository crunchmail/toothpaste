var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-if': 'gulpif',
        'gulp-angular-gettext': 'gettext',
        'gulp-tag-version': 'tag_version'
    }
});

/**
 * Browserify dependencies
 */
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var semver = require('semver');

var browserify = require('browserify');
var watchify = require('watchify');
var assign = require('lodash.assign');

/**
 * Get the current version
 */
var p = require('../package.json');
var git = require('git-rev-sync');
var app_version = p.version;
var app_commit = git.short();

var argv = require('yargs')
.default('env', 'local')
.default('config', '')
.argv;
var prod = argv.env == 'prod' ? true : false;

var paths = require('../gulp.config.json');

var dist = paths.dist + argv.env + '/';

var configApiFile = argv.config === '' ? paths.configFile + argv.env + '-constant' : paths.configFile + argv.config;

// Config
gulp.task("config", function() {
    return gulp.src(configApiFile + '.js')
    .pipe(plugins.rename("constant.js"))
    .pipe(plugins.replace('VERSION', app_version))
    .pipe(plugins.replace('COMMIT', app_commit))
    .pipe(gulp.dest(paths.configFile));
});

// Browserify
var browserifyOpts = {
    entries: [paths.browserifyPath],
    paths: ['./node_modules', 'src/components/', 'src/app/', paths.frontendDirectives],
    debug: (argv.prod ? false : true)
};
var opts = assign({}, watchify.args, browserifyOpts);
var b = watchify(browserify(opts));

b.transform('debowerify');
// on any dep update, runs the bundler
b.on('update', bundle);

// output build logs to terminal
b.on('log', plugins.util.log);

function bundle() {
    return b.bundle()
    // log errors if they happen
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // only minify for production (a lot faster)
    //.pipe(plugins.gulpif(prod, plugins.sourcemaps.init({loadMaps: true})))
    // Do not mangle this one, it creates problems !
    .pipe(plugins.gulpif(prod, plugins.uglify({mangle: false})))
    .pipe(plugins.gulpif(prod, plugins.sourcemaps.write("./")))
    .pipe(gulp.dest(dist + 'js'));
}

gulp.task('browserify', ['config'], bundle);
