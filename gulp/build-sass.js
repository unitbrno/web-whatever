'use strict';

import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';

import {ENV_PRODUCTION, paths} from './constants';


export default (cb, files) => {
    const isProduction = (process.env.NODE_ENV === ENV_PRODUCTION);

    for (let i in files) {
        let file = files[i];

        if (!file.distFileName || !file.sourceFilePath) {
            throw new Error('`distFileName` and `sourceFilePath` has to be defined for each item.');
        }

        let pipe = gulp.src(paths.scss.src + '/' + file.sourceFilePath)
            .pipe(plumber())
            .pipe(rename(file.distFileName)) // must be before sass to keep correct file names between css and sourcemap
            .pipe(sourcemaps.init())
            .pipe(sass({
                noCache: true,
                outputStyle: (isProduction ? 'compressed' : 'expanded')
            }))
            .pipe(autoprefixer({
                browsers: [
                    'last 5 versions', // just for sure in case that newer browser version, which would have <= 0.1 % of usage in the beginning, has less functionality than the previous one :-)
                    '> 0.1%', // makes sense according to http://caniuse.com/usage-table
                    'IE >= 11', // we support only IE 11 (and later if any)
                    'Firefox ESR' // latest enterprise version of Firefox (which could be really old)
                ]
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(plumber.stop())
            .pipe(gulp.dest(typeof file.distPath !== 'undefined' ? file.distPath : paths.scss.dist))
            .on('end', () => {
                if (parseInt(i) === (files.length-1)) { // call only on last pipe
                    cb();
                }
            });
    }
};
