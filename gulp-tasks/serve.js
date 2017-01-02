var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-if': 'gulpif',
        'gulp-angular-gettext': 'gettext',
        'gulp-tag-version': 'tag_version'
    }
});
var argv = require('yargs')
.default('env', 'local')
.default('config', '')
.argv;

var paths = require('../gulp.config.json');

var dist = paths.dist + argv.env + '/';

var configApiFile = argv.config === '' ? '../' + paths.configFile + argv.env + '-constant' : '../' + paths.configFile + argv.config;
var configApi = require(configApiFile);
/**
 * Generate iframe to emulate zimbra/zimlet in local
 */
gulp.task('generate_iframe', ['release'],  function() {
    gulp.src('src/iframe_integration/*.html')
    .pipe(plugins.replace('ENV', argv.env))

    .pipe(plugins.replace('API_URL', configApi.apiUrl))
    .pipe(plugins.replace('API_KEY', configApi.apiKey))
    .pipe(gulp.dest("./static_embedded"));

    gulp.src(dist + '**/*')
    .pipe(gulp.dest("./static_embedded/toothpaste/"));
});

gulp.task('embedded_js', function() {
    gulp.src('src/iframe_integration/*.js')
    .pipe(gulp.dest(dist + "embedded"));
});

/**
 * Launch 2 servers
 * localhost:4000 for toothpaste
 * localhost:4001 for toothpaste integration in a iframe
 * localhost:4002 documentation
 */

gulp.task("dev_server", ['generate_iframe', 'embedded_js'], function() {
    plugins.connect.server({
        root: "dist",
        port: "4000"
    });
    plugins.connect.server({
        root: "./static_embedded",
        port: "4001"
    });
    plugins.connect.server({
        root: "./docs",
        port: "4002"
    });
});
