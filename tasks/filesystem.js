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
import del from 'del';
// import fs from 'fs-extra';

// Clean out .tmp and build directories
gulp.task('clean', () =>
  del(['.tmp', 'build/*', 'static/styles.min.css', 'static/app.js'], { dot : true })
);


// // Symlink built files to Django static folder
// gulp.task('symlink', () => {
//   fs.ensureSymlink('./build/styles/styles.min.css', './static/styles.min.css', (err) => {});
//   fs.ensureSymlink('./build/js/app.min.js', './static/app.min.js', (err) => {});
// });
