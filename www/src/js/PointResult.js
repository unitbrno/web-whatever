class PointResult {
    /**
     * @param {string} name
     * @param {string} address
     * @param {google.maps.LatLng} latlng
     * @param {string} placeId
     */
    constructor(name, address, latlng, placeId) {
        this._name = name;
        this._address = address;
        this._latlng = latlng;
        this._placeId = placeId;
    }

    /**
     * @return {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @return {string}
     */
    get address() {
        return this._address;
    }

    /**
     * @return {google.maps.LatLng}
     */
    get latlng() {
        return this._latlng;
    }

    /**
     * @return {string}
     */
    get placeId() {
        return this._placeId;
    }

    /**
     * @param {object} place
     * @return {PointResult}
     */
    static fromPlace(place) {
        return new PointResult(
            place['name'],
            place['formatted_address'],
            PointResult._buildLocation(place['geometry']['location']),
            place['place_id']
        );
    }

    /**
     * @param {object} location
     * @return {google.maps.LatLng}
     * @private
     */
    static _buildLocation(location) {
        return new google.maps.LatLng(location.lat(), location.lng());
    }
}

module.exports = PointResult;
