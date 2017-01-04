var gulp = require('gulp');
var paths = require('../gulp.config.json');
var argv = require('yargs')
.default('env', 'local')
.default('config', '')
.argv;
var local = argv.env == 'local' ? true : false;

gulp.task('watch', function() {

    if (local) {
        // Watch templates files
        gulp.watch([
            paths.frontendDirectives + '**/*.html',
            paths.internalComponents + '**/*.html'
        ], ['views']);

        gulp.watch([
            paths.frontendDirectives + '**/*.html',
            paths.internalComponents + '**/*.html'
        ], ['views']);

        gulp.watch([
            paths.internalComponents + '**/*.js',
            paths.docs.install,
            paths.docs.api
        ], ['docs']);

        // Watch .less files
        gulp.watch([
            'src/assets/less/*.less',
            paths.FrontendAssets + 'less/*.less'
        ], ['assets']);

        gulp.watch([
            'src/iframe_integration/*'
        ], ['generate_iframe']);

       //Watchers for translate files
       gulp.watch('src/app/commons/languages/*', ['translateFiles']);
   }
});
