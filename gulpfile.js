const gulp = require('gulp');
const watch = require('gulp-watch');
const prefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const rigger = require('gulp-rigger');
const cssmin = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('rimraf');
const browserSync = require("browser-sync");
const reload = browserSync.reload;
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat')

var path = {
    
    build: { 
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },

    src: { 
        html: 'src/*.html', 
        js: 'src/js/main.js',
        style: 'src/style/*.**',
        img: 'src/img/**/*.*', 
        fonts: 'src/fonts/**/*.*'
    },

    watch: { 
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },

    clean: './build',

    tools: {
        js: 'src/js/vendors',
        style: 'src/style/vendors',
    }
};

var serverConfig = {
    server: { baseDir: "./build" },
    tunnel: true,
    host: 'localhost',
    port: 8080,
};

gulp.task('server', () => {
    browserSync(serverConfig);
    gulp.watch(path.watch.html, gulp.series('html'));
    gulp.watch(path.watch.style, gulp.series('style'));
    gulp.watch(path.watch.js, gulp.series('js'));
    gulp.watch(path.watch.img, gulp.series('img'));
    gulp.watch(path.watch.fonts, gulp.series('fonts'));

}); 
gulp.task('scripts', () => {
    return gulp.src([
        './node_modules/jquery/dist/jquery.min.js',
        // './node_modules/popper.js/dist/esm/popper.js',
        './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
    ])
      .pipe(concat('libs.min.js'))
      .pipe(gulp.dest(path.tools.js));
});

gulp.task('html', () => {
    return gulp.src(path.src.html) 
        .pipe(rigger()) 
        .pipe(gulp.dest(path.build.html)) 
        .pipe(reload({stream: true}))
});

gulp.task('js', () => {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}))
});

gulp.task('style', () =>{
    return gulp.src(path.src.style) 
        .pipe(sourcemaps.init()) 
        .pipe(sass()) 
        .pipe(prefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })) 
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) 
        .pipe(reload({stream: true}))
});

gulp.task('img',  () => {
    return gulp.src(path.src.img) 
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) 
        .pipe(reload({stream: true}))
});

gulp.task('fonts', () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('clean',  (cb) => {
    rimraf(path.clean, cb);
});

gulp.task('default', gulp.series('clean', 'scripts', 'html', 'style', 'js', 'img', 'fonts','server'));