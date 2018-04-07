'use strict';

import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

import {ENV_PRODUCTION, paths} from './constants';


export default (cb, files) => {
    const isProduction = (process.env.NODE_ENV === ENV_PRODUCTION);

    for (let i in files) {
        let bundler;
        let file = files[i];

        if (!file.distFileName || !file.sourceFileName || !file.sourcePath) {
            throw new Error('`distFileName`, `sourceFileName` and `sourcePath` has to be defined for each item.');
        }

        bundler = browserify(file.sourcePath, {debug: !isProduction});
        bundler.transform(babelify, {
            presets: ['env'],
            sourceMaps: true
        });
        bundler = bundler.bundle()
            .on('error', console.error.bind(console))
            .pipe(plumber())
            .pipe(source(file.sourceFileName))
            .pipe(rename(file.distFileName))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}));

        if (isProduction) {
            bundler = bundler.pipe(uglify());
        }

        bundler
            .pipe(sourcemaps.write('.'))
            .pipe(plumber.stop())
            .pipe(gulp.dest(paths.js.dist))
            .on('end', () => {
                if (parseInt(i) === (files.length-1)) { // call only on last pipe
                    cb();
                }
            });
    }
};
