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
