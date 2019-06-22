var _package = require('./package.json');

// GULP plugins
var gulp = require("gulp");
var concat = require("gulp-concat-util");
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var wrapper = require('gulp-wrapper');
var filter = require('gulp-filter');
var replace = require('gulp-replace');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var prettyError = require('gulp-prettyerror');
var include = require("gulp-include");
var path = require('path');

// license header prepended to builds
var licenseHeader = '/*! EnlighterJS TinyMCE Plugin [[VERSION]] | Mozilla Public License 2.0 | https://tinymce.enlighterjs.org */\n';

// default
gulp.task('default', ['browser-js', 'less']);

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
            preserveComments: 'license'
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