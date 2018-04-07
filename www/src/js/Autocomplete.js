const PointResult = require('./PointResult');
const BrnoProvider = require('./BrnoProvider');
const MapControl = require('./MapControl');
const PointNotFoundError = require('./PointNotFoundError');

class Autocomplete {
    /**
     * @param {MapControl} mapControl
     * @param {PlaceProvider} placeProvider
     */
    constructor(mapControl, placeProvider) {
        this._mapControl = mapControl;
        this._placeProvider = placeProvider;
    }

    /**
     * @param {object} $input
     * @param {boolean} bindToMap
     */
    bindSearchInput($input, bindToMap) {
        const autocomplete = new google.maps.places.Autocomplete($input[0]);

        if (bindToMap) {
            autocomplete.bindTo('bounds', this._mapControl.getMap());
        } else {
            autocomplete.setBounds(BrnoProvider.getBounds());
        }

        autocomplete.addListener('place_changed', () => {
            $input.data('place', autocomplete.getPlace());
        });

        $input.on('keydown', () => {
            $input.data('place', null);
        });
    }

    /**
     * @param {jQuery} $input
     * @return {Promise<PointResult>}
     * @throws {PointNotFoundError}
     */
    async getPoint($input) {
        const place = $input.data('place') || (await this._loadPlace($input.val()));
        return PointResult.fromPlace(place);
    }

    /**
     * @param {jQuery} $input
     * @return {Promise<string>}
     * @throws {PointNotFoundError}
     */
    async getPlaceId($input) {
        const place = $input.data('place');
        if (place) return place['place_id'];
        return await this._loadPlaceId($input.val());
    }

    /**
     * @param {string} query
     * @return {Promise<object>}
     * @throws {PointNotFoundError}
     */
    async _loadPlace(query) {
        const placeId = await this._loadPlaceId(query);
        return this._placeProvider.getPlace(placeId);
    }

    /**
     * @param {string} query
     * @return {Promise<string>}
     * @throws {PointNotFoundError}
     */
    async _loadPlaceId(query) {
        if (query === '') throw new PointNotFoundError();
        const results = await this._getPlacePredictions(query);
        if (results.length === 0) throw new PointNotFoundError();
        const result = results[0];
        return result['place_id'];
    }

    /**
     * @param {string} query
     * @return {Promise<Array<object>>}
     * @private
     */
    _getPlacePredictions(query) {
        return new Promise((resolve) => {
            this._getAutocompleteService().getPlacePredictions({input: query}, (results, status) => {
                resolve(status === 'OK' ? results : []);
            });
        });
    }

    /**
     * @return {google.maps.places.AutocompleteService}
     * @private
     */
    _getAutocompleteService() {
        if (this._autocompleteService === undefined) {
            this._autocompleteService = new google.maps.places.AutocompleteService();
        }
        return this._autocompleteService;
    }
}

module.exports = Autocomplete;
