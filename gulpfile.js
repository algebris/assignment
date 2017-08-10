const gulp = require('gulp');
const connect = require('gulp-connect');
const open = require('gulp-open');
const browserify = require('gulp-browserify');
const plumber = require('gulp-plumber');
const del = require('del');
const wiredep = require('wiredep').stream;
const copy = require('copy');

const cfg = {
	port: 8080,
	host: 'localhost',
	paths: {
		src: './front',
		dist: './dist',
		html: './front/*.html',
		css: './front/css/*.css',
		js: './front/js/**/*.js',
		json: './front/js/*.json',
		index: './front/index.html',
		bower: './bower_components'
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

gulp.task('copy', function() {
	gulp.src(['front/vendor/**/*'])
		.pipe(gulp.dest(cfg.paths.dist + '/vendor/'));
});

gulp.task('js', () => {
	return gulp.src(cfg.paths.src + '/js/app.js')
		.pipe(plumber())
		.pipe(browserify({ insertGlobals: false }))
		.pipe(gulp.dest(cfg.paths.dist + '/js/'))
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
});

gulp.task('default', ['server','copy','js','html','watch']);