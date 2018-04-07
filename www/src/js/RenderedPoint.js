const DirectionsStatus = require('./DirectionsStatus');

class RenderedPoint {
    /**
     * @param {Point} point
     */
    constructor(point) {
        this._point = point;
        this._marker = null;
        this._directionsResult = null;
        this._directionsStatus = DirectionsStatus.Loading;
        this._directionsRenderer = null;
        this._startTime = point.startTime;
        this._endTime = null;
    }

    /**
     * @return {Point}
     */
    get point() {
        return this._point;
    }

    /**
     * @return {?google.maps.Marker}
     */
    get marker() {
        return this._marker;
    }

    /**
     * @param {?google.maps.Marker} value
     */
    set marker(value) {
        this._marker = value;
    }

    /**
     * @return {?object}
     */
    get directionsResult() {
        return this._directionsResult;
    }

    /**
     * @param {?object} value
     */
    set directionsResult(value) {
        this._directionsResult = value;
    }

    /**
     * @return {string}
     */
    get directionsStatus() {
        return this._directionsStatus;
    }

    /**
     * @param {string} value
     */
    set directionsStatus(value) {
        this._directionsStatus = value;
    }

    /**
     * @return {?google.maps.DirectionsRenderer}
     */
    get directionsRenderer() {
        return this._directionsRenderer;
    }

    /**
     * @param {?google.maps.DirectionsRenderer} value
     */
    set directionsRenderer(value) {
        this._directionsRenderer = value;
    }

    /**
     * @return {?Date}
     */
    get startTime() {
        return this._startTime;
    }

    /**
     * @param {?Date} value
     */
    set startTime(value) {
        this._startTime = value;
    }

    /**
     * @return {?Date}
     */
    get endTime() {
        return this._endTime;
    }

    /**
     * @param {?Date} value
     */
    set endTime(value) {
        this._endTime = value;
    }
}


module.exports = RenderedPoint;
