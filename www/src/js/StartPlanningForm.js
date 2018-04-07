const Autocomplete = require('./Autocomplete');
const Point = require('./Point');
const PointNotFoundError = require('./PointNotFoundError');

class StartPlanningForm {
    /**
     * @param {Autocomplete} autocomplete
     */
    constructor(autocomplete) {
        this._autocomplete = autocomplete;
        this._$form = $('#start-planning-form');
    }

    /**
     * @return {void}
     */
    init() {
        const $addressInput = this._$form.find('.address-input');
        this._autocomplete.bindSearchInput($addressInput, false);

        $(document.body).on('click', '.start-planning-button', async (event) => {
            event.preventDefault();
            await this._handleSubmit();
        });
    }

    /**
     * @return {Promise<void>}
     * @private
     */
    async _handleSubmit() {
        const $addressInput = this._$form.find('.address-input');
        try {
            const placeId = await this._autocomplete.getPlaceId($addressInput);
            window.location.href = this._formatRedirectUrl(placeId);
        } catch (e) {
            if (e instanceof PointNotFoundError) {
                // TODO: display error
            }
        }
    }

    /**
     * @param {string} placeId
     * @return {string}
     * @private
     */
    _formatRedirectUrl(placeId) {
        let url = this._$form.data('url');
        url += (url.indexOf('?') === -1 ? '?' : '&');
        url += 'placeId=' + encodeURIComponent(placeId);
        return url;
    }
}

module.exports = StartPlanningForm;
