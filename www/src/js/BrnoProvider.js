class BrnoProvider {
    /**
     * @return {google.maps.LatLng}
     */
    static getLocation() {
        return new google.maps.LatLng(49.19522, 16.60796);
    }

    /**
     * @return {google.maps.LatLngBounds}
     */
    static getBounds() {
        const circle = new google.maps.Circle({
            center: BrnoProvider.getLocation(),
            radius: 20000
        });
        return circle.getBounds();
    }
}

module.exports = BrnoProvider;
