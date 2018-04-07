class LandingPage {
    /**
     * @param {StartPlanningForm} startPlanningForm
     */
    constructor(startPlanningForm) {
        this._startPlanningForm = startPlanningForm;
    }

    /**
     * @return {void}
     */
    init() {
        this._startPlanningForm.init();
    }
}

module.exports = LandingPage;
