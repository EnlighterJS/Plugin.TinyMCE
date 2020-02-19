const _package = require('./package.json');

// GULP plugins
const gulp = require("gulp");
const concat = require("gulp-concat-util");
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const wrapper = require('gulp-wrapper');
const filter = require('gulp-filter');
const replace = require('gulp-replace');
const less = require('gulp-less');
const minifyCSS = require('gulp-minify-css');
const prettyError = require('gulp-prettyerror');
const include = require("gulp-include");
const path = require('path');

// license header prepended to builds
const licenseHeader = '/*! EnlighterJS TinyMCE Plugin [[VERSION]] | Mozilla Public License 2.0 | https://tinymce.enlighterjs.org */\n';

// default release build
gulp.task('browser-js', function(){
    return gulp.src('src/Plugin.js')
        .pipe(prettyError())

        // concat all files
        .pipe(include())

        // rename file
        .pipe(rename('enlighterjs.tinymce.js'))

        // add function wrapper and license header
        .pipe(wrapper({
            header: licenseHeader
        }))

        // add version string
        .pipe(replace(/\[\[VERSION]]/g, _package.version))

        // write merged version
        .pipe(gulp.dest('dist'))

        // create minified (compressed) version
        .pipe(uglify({
            compress: true,
            output: {
                comments: /^!/
            }
        }))
        .pipe(rename({
            suffix: '.min'
        }))

        .pipe(gulp.dest('dist'))
});

// LESS to CSS (Base + Themes)
gulp.task('less', function () {
    return gulp.src('src/editor-styles.less')
        .pipe(prettyError())

        .pipe(less())
        .pipe(minifyCSS())
        .pipe(concat('enlighterjs.tinymce.min.css'))

        // add license header
        .pipe(wrapper({
            header: licenseHeader
        }))

        // add version string
        .pipe(replace(/\[\[VERSION]]/g, _package.version))

        .pipe(gulp.dest('dist'));
});


// default
gulp.task('default', gulp.series(['browser-js', 'less']));
