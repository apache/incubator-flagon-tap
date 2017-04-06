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

const plugins = gulpLoadPlugins();

// Lint JS
gulp.task('lint', () =>
  gulp.src('public/**/*.{js,jsx}')
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
);


// Test JS
gulp.task('mocha', () =>
  gulp.src(['test/**/*.js'], { read : false })
    .pipe(plugins.mocha({ reporter : 'list' }))
    .on('error', plugins.util.log)
);


// Test and lint watching
gulp.task('test', () => {
  gulp.watch(['public/**/*.{js,jsx}'], ['lint', 'mocha']);
});
