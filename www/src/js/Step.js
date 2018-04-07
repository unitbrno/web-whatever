const StepType = require('./StepType');

class Step {
    /**
     * @param {string} type
     * @param {?Point} point
     * @param {?TransitInfo} transitInfo
     * @param {?Date} startTime
     * @param {?Date} endTime
     * @param {?number} walkingDuration
     * @param {?number} walkingDistance
     * @param {?boolean} walkingWarning
     * @param {?boolean} noRouteWarning
     */
    constructor(
        type,
        point,
        transitInfo,
        startTime,
        endTime,
        walkingDuration,
        walkingDistance,
        walkingWarning,
        noRouteWarning
    ) {
        this._type = type;
        this._point = point;
        this._transitInfo = transitInfo;
        this._startTime = startTime;
        this._endTime = endTime;
        this._walkingDuration = walkingDuration;
        this._walkingDistance = walkingDistance;
        this._walkingWarning = walkingWarning;
        this._noRouteWarning = noRouteWarning;
    }

    /**
     * @return {string}
     */
    get type() {
        return this._type;
    }

    /**
     * @return {Point}
     */
    get point() {
        return this._point;
    }

    /**
     * @return {TransitInfo}
     */
    get transitInfo() {
        return this._transitInfo;
    }

    /**
     * @return {?Date}
     */
    get startTime() {
        return this._startTime;
    }

    /**
     * @return {?Date}
     */
    get endTime() {
        return this._endTime;
    }

    /**
     * @return {?number}
     */
    get walkingDuration() {
        return this._walkingDuration;
    }

    /**
     * @return {?number}
     */
    get walkingDistance() {
        return this._walkingDistance;
    }

    /**
     * @return {?boolean}
     */
    get walkingWarning() {
        return this._walkingWarning;
    }

    /**
     * @return {?boolean}
     */
    get noRouteWarning() {
        return this._noRouteWarning;
    }

    /**
     * @return {boolean}
     */
    get delayed() {
        return this._point !== null && this._startTime !== null && this._startTime > this._point.startTime;
    }

    /**
     * @return {?number}
     */
    get delayInMinutes() {
        if (!this.delayed) return null;
        return moment(this._startTime).diff(moment(this._point.startTime), 'minutes');
    }

    /**
     * @return {number}
     */
    get durationInMinutes() {
        if (this._type === StepType.Walking) {
            return this._walkingDuration;
        } else {
            const startMoment = moment(this._startTime);
            const endMoment = moment(this._endTime);
            return endMoment.diff(startMoment, 'minutes');
        }
    }
}

module.exports = Step;
