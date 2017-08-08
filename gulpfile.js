const gulp = require('gulp');
const connect = require('gulp-connect');
const open = require('gulp-open');
const browserify = require('gulp-browserify');
const plumber = require('gulp-plumber');
const del = require('del');

const cfg = {
	port: 8080,
	host: 'localhost',
	paths: {
		src: './front',
		dist: './dist',
		html: './front/*.html',
		css: './front/css/*.css',
		js: './front/js/*.js',
		json: './front/js/*.json'
	}
};

gulp.task('server', () => {
    connect.server({
    	port: cfg.port,
    	host: cfg.localhost,
    	root: cfg.paths.dist,
        livereload: true,
    });
});

gulp.task('js', () => {
	return gulp.src(cfg.src + '/js/app.js')
		.pipe(plumber())
		.pipe(browserify({ insertGlobals: true }))
		.pipe(gulp.dest('./dist/js/'))
		.pipe(connect.reload());
});

gulp.task('html', () => {
    gulp.src(cfg.paths.html)
        .pipe(gulp.dest(cfg.paths.dist))
        .pipe(connect.reload());
});

gulp.task('watch', () => {
	gulp.watch([cfg.paths.html], ['html']);
	gulp.watch([cfg.paths.js], ['js']);
	// gulp.watch([cfg.paths.css], ['css']);
});

gulp.task('default', ['server','watch']);