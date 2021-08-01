const childProcess = require('child_process')
const GhostAdminApi = require('@tryghost/admin-api')
const gulp = require('gulp')
const gulpSass = require('gulp-sass')(require('sass'))

gulp.task('scss', function () {
    return gulp.src('assets/scss/**/*scss')
        .pipe(gulpSass({OutputStyle: 'compressed'}))
        .pipe(gulp.dest('assets/css'))
})

gulp.task('watch', function () {
    return gulp.watch('assets/scss/**/*.scss', gulp.parallel('scss'))
})


gulp.task('deploy', function (done) {
    childProcess.execSync('git archive --format zip --output leoblog.zip master')

    const api = new GhostAdminApi({
        url: `https://${process.env.GHOST_HOST}`,
        version: 'v3',
        key: process.env.GHOST_ADMIN_API_KEY
    })

    api.themes.upload({'file': 'leoblog.zip'})
    api.themes.activate('leoblog')

    done()
})

gulp.task('default', gulp.series('scss', 'watch'))
