// Licensed to the Apache Software Foundation (ASF) under one or more
// contributor license agreements.  See the NOTICE file distributed with
// this work for additional information regarding copyright ownership.
// The ASF licenses this file to You under the Apache License, Version 2.0
// (the "License"); you may not use this file except in compliance with
// the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
