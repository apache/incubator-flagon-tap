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
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';

import buildSemantic from '../semantic/tasks/build';
import watchSemantic from '../semantic/tasks/watch';

const plugins = gulpLoadPlugins();

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Semantic UI tasks
gulp.task('buildSemantic', buildSemantic);
gulp.task('watchSemantic', watchSemantic);


// Copy Semantic UI
gulp.task('copySemantic', () => {
  return gulp.src([
    'semantic/dist/semantic.min.css',
    'semantic/dist/semantic.min.js',
    'semantic/dist/themes/default/assets/fonts/icons.woff2',
  ], { base : 'semantic/dist' })
    .pipe(gulp.dest('static'));
});


// Build and prefix styles
gulp.task('sass', () => {
  return gulp.src([
    'stylesheets/**/*.scss',
    'stylesheets/**/*.css'
  ], { base : 'stylesheets' })
    .pipe(plugins.newer('.tmp/styles'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      precision : 10
    }).on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'));
});


// Concatenate and minify styles
gulp.task('bundle:styles', () => {
  return gulp.src([
    // 'semantic/dist/semantic.css',
    '.tmp/styles/**/*.css'
  ])
    .pipe(plugins.concat('styles.min.css'))
    .pipe(plugins.cssnano())
    .pipe(plugins.size({ title : 'styles' }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('build/styles'))
    .pipe(gulp.dest('static'));
});


// Build the styles
gulp.task('styles:build', (done) => {
  return runSequence(
    [
      'buildSemantic',
      'sass'
    ],
    'copySemantic',
    'bundle:styles',
    done
  );
});


// Watch for style changes
gulp.task('styles:watch', () => {
  gulp.watch(['stylesheets/**/*.scss', 'stylesheets/**/*.css'], ['sass', 'bundle:styles']);
  gulp.watch(['semantic/dist/semantic.min.css'], ['copySemantic']);
});


// Development task for all styles
gulp.task('styles', () => {
  return runSequence(
    [
      // 'watchSemantic',
      'styles:watch'
    ]
  );
});
