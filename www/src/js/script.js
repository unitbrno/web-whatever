require('babel-core/register');
require('babel-polyfill');

const Container = require('./Container');

window.initWhateverBox = async () => {
    const container = new Container();

    const $body = $(document.body);
    const page = $body.data('page');

    if (page === 'landing') {
        container.landingPage.init();
    } else if (page === 'planning') {
        await container.planningPage.init();
    }
};

if (window._whateverBoxInitializeImmediately) {
    window.initWhateverBox();
}
