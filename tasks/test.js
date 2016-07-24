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
    .pipe(plugins.mocha({ reporter : list }))
    .on('error', plugins.util.log)
);


// Test and lint watching
gulp.task('test', () => {
  gulp.watch(['public/**/*.{js,jsx}'], ['lint', 'mocha']);
});
