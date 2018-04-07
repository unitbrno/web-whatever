'use strict';

import gulp from 'gulp';
import taskListing from 'gulp-task-listing';

import {paths} from './gulp/constants';
import buildJs from './gulp/build-js';
import buildSass from './gulp/build-sass';
import runServer from './gulp/run-server';


// BUILD

gulp.task('default', ['build']);

gulp.task('build', [
    'build:sass',
    'build:js',
]);


// SASS

gulp.task('build:sass', (cb) => {
    buildSass(cb, [
        {
            distFileName: 'propeller.css',
            sourceFilePath: '../../../node_modules/propellerkit/scss/propeller.scss',
        },
        {
            distFileName: 'style.css',
            sourceFilePath: 'main.scss',
        }
    ]);
});

gulp.task('watch:sass', ['build:sass'], () => {
    gulp.watch(paths.scss.src + '/**/*.scss', ['build:sass']);
});


// JS

gulp.task('build:js', (cb) => {
    buildJs(cb, [
        {
			distFileName: 'script.js',
			sourceFileName: 'script.js',
			sourcePath: paths.js.src + '/script.js',
		},
    ]);
});

gulp.task('watch:js', ['build:js'], () => {
    gulp.watch(paths.js.src + '/**/*.js', ['build:js']);
});


// HELPERS

gulp.task('run:server', () => {
    runServer('www');
});


gulp.task('help', taskListing);

gulp.task('watch', [
    'watch:sass',
    'watch:js',
    'run:server',
]);
