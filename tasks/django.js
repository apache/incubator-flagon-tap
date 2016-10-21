import gulp from 'gulp';
import { exec } from 'child_process';

gulp.task('django', () => {
  // For Vagrant
  var django = exec('cd /vagrant; python /vagrant/manage.py runserver 0.0.0.0:8000');

  // For Not-Vagrant
  // var django = exec('manage.py runserver 0.0.0.0:8000');

  // django.stderr.on('data', (data) => {
  //   process.stdout.write(data);
  // });
  //
  // django.stdout.on('data', (data) => {
  //   process.stdout.write(data);
  // });

  process.on('SIGTERM', () => {
    django.kill();
    process.exit();
  });

  process.on('SIGINT', () => {
    django.kill();
    process.exit();
  });
});
