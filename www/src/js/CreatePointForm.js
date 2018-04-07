const Autocomplete = require('./Autocomplete');
const PointNotFoundError = require('./PointNotFoundError');
const Point = require('./Point');

class CreatePointForm {

    /**
     * @param {MapControl} mapControl
     * @param {Autocomplete} autocomplete
     */
    constructor(mapControl, autocomplete) {
        this._mapControl = mapControl;
        this._autocomplete = autocomplete;
        this._$form = $('#point-form');
    }

    /**
     * @return {Promise<void>}
     */
    async init() {
        const $addressInput = this._$form.find('.address-input');
        this._autocomplete.bindSearchInput($addressInput, true);
        this._initializeDurationSection();
    }

    /**
     * @return {void}
     * @private
     */
    _initializeDurationSection() {
        const $checkbox = this._$form.find('.duration-checkbox');
        const $timeSection = this._$form.find('.duration-time-section');

        $timeSection.collapse('show');
        $checkbox.change(() => {
            $timeSection.collapse($checkbox.prop('checked') ? 'hide' : 'show');
        });
    }

    /**
     * @return {void}
     */
    register() {
        $(document.body).on('click', '#add-point-button', () => {
            this._clearForm();
            this._$form.modal('show');
        });

        $(document.body).on('click', '#point-form .submit-button', async (e) => {
            e.preventDefault();
            await this._handleSubmit();
        });

        $(document.body).on('click', '#point-form .start-date-container .button-up', async (e) => {
            e.preventDefault();
            this._changeStartDate(1);
        });

        $(document.body).on('click', '#point-form .start-date-container .button-down', async (e) => {
            e.preventDefault();
            this._changeStartDate(-1);
        });

        $(document.body).on('click', '#point-form .start-time-container .button-up', async (e) => {
            e.preventDefault();
            this._changeStartTime(1);
        });

        $(document.body).on('click', '#point-form .start-time-container .button-down', async (e) => {
            e.preventDefault();
            this._changeStartTime(-1);
        });
    }

    /**
     * @param {string} name
     * @return {void}
     */
    open(name) {
        this._clearForm();
        this._$form.modal('show');
        this._$form.find('.address-input').data('place', null);
        this._$form.find('.address-input').val(name).trigger('change');
    }

    /**
     * @return {void}
     * @private
     */
    _clearForm() {
        this._$form.find('.place-not-found-error').hide();
        this._$form.find('.address-input').val('');
        this._setStartDateTime(this._mapControl.getDefaultTimeOfNewPoint() || (new Date()));
        this._$form.find('.duration-hours-input').val('');
        this._$form.find('.duration-minutes-select').val('0');
    }

    /**
     * @return {void}
     * @private
     */
    async _handleSubmit() {
        try {
            const point = await this._createPoint();
            await this._mapControl.addPoint(point);
            this._$form.modal('hide');
        } catch (e) {
            if (e instanceof PointNotFoundError) {
                this._$form.find('.place-not-found-error').show();
            }
        }
    }

    /**
     * @return {Point}
     * @throws {PointNotFoundError}
     * @private
     */
    async _createPoint() {
        const point = await this._autocomplete.getPoint(this._$form.find('.address-input'));
        const startTime = this._getStartDateTime();

        let duration = null;
        if (!this._$form.find('.duration-checkbox').prop('checked')) {
            const durationHours = this._parseInt(this._$form.find('.duration-hours-input').val());
            const durationMinutes = this._parseInt(this._$form.find('.duration-minutes-input').val());
            duration = durationHours * 60 + durationMinutes;
        }

        return new Point(point.name, point.address, point.latlng, startTime, duration);
    }

    /**
     * @param {number} dayChange
     * @return {void}
     * @private
     */
    _changeStartDate(dayChange) {
        const value = this._getStartDateTime();
        const date = moment(value).add(dayChange, 'days').format('DD.MM.YYYY');
        const newValue = this._formatStartDate(date);
        this._$form.find('.start-date-input').val(newValue);
    }

    /**
     * @param {number} hourChange
     * @return {void}
     * @private
     */
    _changeStartTime(hourChange) {
        const value = this._getStartDateTime();
        const newValue = moment(value).add(hourChange, 'hours').set('minutes', 0).format('HH:mm');
        this._$form.find('.start-time-input').val(newValue);
    }

    /**
     * @param {string} date
     * @return {string}
     * @private
     */
    _formatStartDate(date) {
        if (date === this._getToday()) {
            return this._getTranslation('today');
        } else if (date === this._getTomorrow()) {
            return this._getTranslation('tomorrow');
        } else {
            return date;
        }
    }

    /**
     * @param {string} key
     * @return {string}
     * @private
     */
    _getTranslation(key) {
        return $(document.body).data('translations')[key];
    }

    /**
     * @return {Date}
     * @private
     */
    _getStartDateTime() {
        const date = this._getStartDate();
        const time = this._getStartTime();
        return moment(date + ' ' + time, 'DD.MM.YYYY HH:mm').toDate();
    }

    /**
     * @param {Date} dateTime
     * @return {void}
     * @private
     */
    _setStartDateTime(dateTime) {
        const date = moment(dateTime).format('DD.MM.YYYY');
        const time = moment(dateTime).format('HH:mm');
        this._$form.find('.start-date-input').val(this._formatStartDate(date)).trigger('change');
        this._$form.find('.start-time-input').val(time).trigger('change');

    }

    /**
     * @return {string}
     * @private
     */
    _getStartDate() {
        const value = this._$form.find('.start-date-input').val();

        if (value === this._getTranslation('today')) {
            return this._getToday();
        } else if (value === this._getTranslation('tomorrow')) {
            return this._getTomorrow();
        } else {
            return value;
        }
    }

    /**
     * @return {string}
     * @private
     */
    _getStartTime() {
        return this._$form.find('.start-time-input').val();
    }

    /**
     * @return {string}
     * @private
     */
    _getToday() {
        return moment(new Date()).format('DD.MM.YYYY');
    }

    /**
     * @return {string}
     * @private
     */
    _getTomorrow() {
        return moment(new Date()).add(1, 'days').format('DD.MM.YYYY');
    }

    /**
     * @param {string} s
     * @return {number}
     * @private
     */
    _parseInt(s) {
        const value = parseInt(s);
        if (isNaN(value)) {
            return 0;
        }
        return value;
    }
}

module.exports = CreatePointForm;
