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

gulp.task('docker', ['serve:backend', 'build']);
