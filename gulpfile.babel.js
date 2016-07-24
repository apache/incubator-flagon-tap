import gulp from 'gulp';
import path from 'path';
import del from 'del';
import requireDir from 'require-dir';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
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
      'js'
    ],
    'symlink'
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
