class PlaceProvider {
    /**
     * @param {MapControl} mapControl
     */
    setMapControl(mapControl) {
        this._mapControl = mapControl;
    }

    /**
     * @param {string} placeId
     * @return {Promise<object>}
     */
    getPlace(placeId) {
        return new Promise((resolve) => {
            this._getPlacesService().getDetails({placeId: placeId}, (result) => {
                resolve(result);
            });
        });
    }

    /**
     * @return {google.maps.places.PlacesService}
     * @private
     */
    _getPlacesService() {
        if (this._mapControl === undefined) return undefined;
        if (this._placesService === undefined) {
            this._placesService = new google.maps.places.PlacesService(this._mapControl.getMap());
        }
        return this._placesService;
    }
}

module.exports = PlaceProvider;
