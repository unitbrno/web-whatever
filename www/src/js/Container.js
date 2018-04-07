const Autocomplete = require('./Autocomplete');
const CreatePointForm = require('./CreatePointForm');
const LandingPage = require('./LandingPage');
const MapControl = require('./MapControl');
const MapSidebarRenderer = require('./MapSidebarRenderer');
const PlaceProvider = require('./PlaceProvider');
const PlanningPage = require('./PlanningPage');
const StartPlanningForm = require('./StartPlanningForm');

class Container {
    /**
     * @returns {Autocomplete}
     */
    get autocomplete() {
        if (this._autocomplete === undefined) {
            this._autocomplete = new Autocomplete(this.mapControl, this.placeProvider);
        }
        return this._autocomplete;
    }

    /**
     * @return {!CreatePointForm}
     */
    get createPointForm() {
        if (this._createPointForm === undefined) {
            this._createPointForm = new CreatePointForm(this.mapControl, this.autocomplete);
        }
        return this._createPointForm;
    }

    /**
     * @return {!LandingPage}
     */
    get landingPage() {
        if (this._landingPage === undefined) {
            this._landingPage = new LandingPage(this.startPlanningForm);
        }
        return this._landingPage;
    }

    /**
     * @return {!MapControl}
     */
    get mapControl() {
        if (this._mapControl === undefined) {
            this._initializeMapControl();
        }
        return this._mapControl;
    }

    /**
     * @return {void}
     * @private
     */
    _initializeMapControl() {
        this._mapSidebarRenderer = new MapSidebarRenderer();
        this._placeProvider = new PlaceProvider();

        this._mapControl = new MapControl(this._mapSidebarRenderer, this._placeProvider);
        this._mapSidebarRenderer.setMapControl(this.mapControl);
        this._placeProvider.setMapControl(this._mapControl);
    }

    /**
     * @return {!MapSidebarRenderer}
     */
    get mapSidebarRenderer() {
        if (this._mapSidebarRenderer === undefined) {
            this._initializeMapControl();
        }
        return this._mapSidebarRenderer;
    }

    /**
     * @return {!PlaceProvider}
     */
    get placeProvider() {
        if (this._placeProvider === undefined) {
            this._initializeMapControl();
        }
        return this._placeProvider;
    }

    /**
     * @return {!PlanningPage}
     */
    get planningPage() {
        if (this._planningPage === undefined) {
            this._planningPage = new PlanningPage(this.mapControl, this.createPointForm);
        }
        return this._planningPage;
    }

    /**
     * @returns {StartPlanningForm}
     */
    get startPlanningForm() {
        if (this._startPlanningForm === undefined) {
            this._startPlanningForm = new StartPlanningForm(this.autocomplete);
        }
        return this._startPlanningForm;
    }
}

module.exports = Container;
