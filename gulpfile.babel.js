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
import path from 'path';
import del from 'del';
import requireDir from 'require-dir';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';

var spawn = require('child_process').spawn;

// import browserSync from 'browser-sync';

requireDir('./tasks');

const plugins = gulpLoadPlugins();
// const reload = browserSync.reload;


gulp.task('sync', () => {
  // Include browsersync here
});


gulp.task('build', () => {
  return runSequence(
    'clean',
    [
      'styles:build',
      'js:build'
    ]
  );
});


gulp.task('dev', () => {
  return runSequence(
    'clean',
    [
      'styles:build'
    ],
    [
      // 'django',
      // 'test',
      'styles',
      'js'
    ]
  );
});

gulp.task('serve:backend', () => {
  var devServerPort = process.env.PORT || 8000;
  process.env.PYTHONBUFFERED = 1;
  process.env.PYTHONDONTWRITEBITECODE = 1;
  spawn('python', ['manage.py', 'runserver', '0.0.0.0:' + devServerPort], {
    stdio: 'inherit'
  });
});

// gulp.task('docker', () => {
//   gulp.start('serve:backend');
//   gulp.start('build');
// });

gulp.task('docker', ['build']);
