class TransitInfo {
    /**
     * @param {string} vehicle
     * @param {string} lineNumber
     * @param {string} departureStop
     * @param {string} arrivalStop
     * @param {string} headsign
     */
    constructor(vehicle, lineNumber, departureStop, arrivalStop, headsign) {
        this._vehicle = vehicle;
        this._lineNumber = lineNumber;
        this._departureStop = departureStop;
        this._arrivalStop = arrivalStop;
        this._headsign = headsign;
    }

    /**
     * @return {string}
     */
    get vehicle() {
        return this._vehicle;
    }

    /**
     * @return {string}
     */
    get lineNumber() {
        return this._lineNumber;
    }

    /**
     * @return {string}
     */
    get departureStop() {
        return this._departureStop;
    }

    /**
     * @return {string}
     */
    get arrivalStop() {
        return this._arrivalStop;
    }

    /**
     * @return {string}
     */
    get headsign() {
        return this._headsign;
    }
}

module.exports = TransitInfo;
