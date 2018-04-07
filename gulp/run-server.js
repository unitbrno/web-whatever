'use strict';

const exec = require('child_process').exec;


export default (documentRoot, domain, port) => {
    if (typeof documentRoot === 'undefined') {
        throw new Error('`documentRoot` must be set.');
    }

    let _domain = domain || 'localhost';
    let _port = port || '8000';

    const url = _domain + ':' + _port;

    exec('php -S ' + url + ' -t ' + documentRoot);
    console.log('You can access this project at following address: http://' + url);
};
