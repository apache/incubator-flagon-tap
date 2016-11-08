import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import assign from 'lodash.assign';

const plugins = gulpLoadPlugins();

var customOpts = {
  entries : ['./public/index.jsx'],
  debug : true,
  extensions : ['.js', '.jsx']
};

var opts = assign({}, watchify.args, customOpts);
// var b = watchify(browserify(opts), { poll : 500 });
var b = watchify(browserify(opts));
var build = browserify(opts);

b.transform(babelify, { presets : [ 'es2015', 'react' ] });
build.transform(babelify, { presets: ['es2015', 'react'] });

function bundle () {
  return b.bundle()
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({ loadMaps : true }))
    // .pipe(plugins.uglify())
    // .on('error', plugins.util.log)
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('build/js'))
    .pipe(gulp.dest('static'));
}

function buildBundle() {
  return build.bundle()
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(gulp.dest('static'));
}


gulp.task('js', bundle);
b.on('update', bundle);
b.on('log', plugins.util.log);

gulp.task('js:build', buildBundle);
