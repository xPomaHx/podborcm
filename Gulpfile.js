'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    rigger = require('gulp-include'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    minifyHTML = require('gulp-htmlmin'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    uncss = require('gulp-uncss'),
    ftp = require('gulp-ftp'),
    imageop = require('gulp-image-optimization'),
    babel = require('gulp-babel'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    img64 = require('gulp-img64'),
    cssBase64 = require('gulp-css-base64'),
    merge = require('merge2'),
    argv = require('yargs').argv,
    //PrjName=process.argv[2].replace('--','')+'/';
    PrjName = argv.f + '/';

console.log(PrjName);
var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: PrjName + 'build/',
        js: PrjName + 'build/js/',
        css: PrjName + 'build/css/',
        img: PrjName + 'build/img/',
        fonts: PrjName + 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: PrjName + 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: PrjName + 'src/js/main.js', //В стилях и скриптах нам понадобятся только main файлы
        style: PrjName + 'src/style/main.less',
        img: PrjName + 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: PrjName + 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: PrjName + 'src/**/*.html',
        js: PrjName + 'src/js/**/*.js',
        style: PrjName + 'src/style/**/*.less',
        img: PrjName + 'src/img/**/*.*',
        fonts: PrjName + 'src/fonts/**/*.*'
    },
    clean: './build'
};
console.log(path);
var config = {
    server: {
        baseDir: PrjName + 'build'
    },
    tunnel: false,
    host: '0.0.0.0',
    port: 35795,
    logPrefix: 'BRO-Dev'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути

        .pipe(rigger()) //Прогоним через rigger

        // .pipe(img64())
        .pipe(minifyHTML({
            collapseWhitespace: true,
            removeComments: true,
            conditionals: true,
            spare: true,
            empty: true,
            comments: true,
            loose: false,
            ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[=|php]?[\s\S]*?\?>/],
        }))

        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({ stream: true })); //И перезагрузим наш сервер для обновлений
});
gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(plumber())
        .pipe(rigger()) //Прогоним через rigger
        //.pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(babel({
            presets: ['es2015'],
            compact: false
        }))
        .pipe(uglify()) //Сожмем наш js
        //.pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({ stream: true })); //И перезагрузим сервер
});
gulp.task('style:build', function () {
    var stream1 = gulp.src(PrjName + 'src/style/uncss.less')
        .pipe(plumber())
        .pipe(rigger())
        .pipe(less())
        .pipe(uncss({
            html: [path.watch.html]
        }));

    var stream2 = gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(less());

    return merge(stream1, stream2)
        .pipe(concat('style.css'))
        .pipe(prefixer())
        .pipe(cssmin({ keepSpecialComments: 0 }))
        .pipe(cssnano())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream: true }));

});
gulp.task('image:build', function () {
    gulp.src(path.src.img).pipe(gulp.dest(path.build.img));
    gulp.src(path.src.img) //Выберем наши картинки
        /*.pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        }))*/
        /*.pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))*/
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({ stream: true }));
});
gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
    gulp.src(PrjName + 'src/*.xml')
        .pipe(gulp.dest(path.build.html));
    gulp.src(PrjName + 'src/*.png')
        .pipe(gulp.dest(path.build.html));
    gulp.src(PrjName + 'src/*.ico')
        .pipe(gulp.dest(path.build.html));
    gulp.src(PrjName + 'src/.htaccess')
        .pipe(gulp.dest(path.build.html));
    gulp.src(PrjName + 'src/*.php')
        .pipe(gulp.dest(path.build.html));

});
gulp.task('build', [
    'image:build',
    'html:build',
    'js:build',
    'style:build',
    'fonts:build'

]);
gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');


    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');


    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');


    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');


    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');


    });
});
gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
//console.log(path.build.html+'*');

gulp.task('default', ['build', 'webserver', 'watch']);