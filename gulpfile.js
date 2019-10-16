const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

gulp.task('processHTML', done => {
  gulp.src(['index.html', 'blog.html'])
    .pipe(gulp.dest('dist'));
    done();
});

gulp.task('processJS', done => {
  gulp.src(['functions.js', 'blog.js'])
    //Linting of code
    .pipe(jshint({
      esversion: 8
    }))
    .pipe(jshint.reporter('default'))
    //Transpiling of code
    .pipe(babel({
      presets: ['@babel/env']
    }))
    //Minifying of code
    .pipe(terser()) // Uglify
    .pipe(gulp.dest('dist'));
    done();
});

gulp.task('babelPolyfill', done => {
  gulp.src('node_modules/babel-polyfill/browser.js')
    .pipe(gulp.dest('dist/node_modules/babel-polyfill'));
    done();
});

gulp.task('watch', done => {
    gulp.watch(['functions.js', 'blog.js'], gulp.series('processJS'));
    gulp.watch(['index.html', 'blog.html'], gulp.series('processHTML'));

    gulp.watch(['dist/blog.js', 'dist/functions.js'], browserSync.reload);
    gulp.watch(['dist/index.html', 'dist/blog.html'], browserSync.reload);

    done();
});

gulp.task('browserSync', done => {
  browserSync.init({
    server: './dist',
    port: 8080,
    ui: {
      port: 8081
    }
  });
    done();
});

gulp.task('default', gulp.series(['processHTML', 'processJS', 'babelPolyfill', 'watch'], done => {
    done();
}));
