const gulp = require('gulp');
const inlineCss = require('gulp-inline-css');

gulp.task('default', function () {
  return gulp.src('./src/*.html')
    .pipe(inlineCss({
      applyStyleTags: true,
      applyLinkTags: true,
      removeStyleTags: true,
      removeLinkTags: true
    }))
    .pipe(gulp.dest('../../../assets/email-templates'));
});
