class Point {
    /**
     * @param {string} name
     * @param {string} address
     * @param {google.maps.LatLng} latlng
     * @param {Date} startTime
     * @param {?number} duration
     */
    constructor(name, address, latlng, startTime, duration) {
        this._name = name;
        this._address = address;
        this._latlng = latlng;
        this._startTime = startTime;
        this._duration = duration;
    }

    /**
     * @return {?number}
     */
    get number() {
        return this._number;
    }

    /**
     * @param {?number} value
     */
    set number(value) {
        this._number = value;
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
     * @return {Date}
     */
    get startTime() {
        return this._startTime;
    }

    /**
     * @return {?number}
     */
    get duration() {
        return this._duration;
    }
}

module.exports = Point;
