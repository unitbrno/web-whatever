const BrnoProvider = require('./BrnoProvider');
const DirectionsStatus = require('./DirectionsStatus');
const Point = require('./Point');
const PointResult = require('./PointResult');
const RenderedPoint = require('./RenderedPoint');
const Step = require('./Step');
const StepType = require('./StepType');
const TransitInfo = require('./TransitInfo');

class MapControl {
    /**
     * @param {MapSidebarRenderer} mapSidebarRenderer
     * @param {PlaceProvider} placeProvider
     */
    constructor(mapSidebarRenderer, placeProvider) {
        this._mapSidebarRenderer = mapSidebarRenderer;
        this._placeProvider = placeProvider;
    }

    /**
     * @return {Promise<void>}
     */
    async init() {
        this._map = new google.maps.Map(document.getElementById('map-control'), {
            zoom: 12,
            center: BrnoProvider.getLocation(),
        });
        this._directionsService = new google.maps.DirectionsService();
        this._points = [];
        this._renderId = 0;
        this._renderedPoints = [];
        this._steps = null;
    }

    /**
     * @return {Promise<void>}
     */
    async loadFirstPointFromUrl() {
        const placeId = this._getQueryParameter('placeId');
        if (placeId === null) return;
        const place = await this._placeProvider.getPlace(placeId);
        const pointResult = PointResult.fromPlace(place);
        await this.addPoint(new Point(pointResult.name, pointResult.address, pointResult.latlng, new Date(), null));
    }

    /**
     * @param {string} name
     * @return {?string}
     * @private
     */
    _getQueryParameter(name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    /**
     * @return {google.maps.Map}
     */
    getMap() {
        return this._map;
    }

    /**
     * @param {Point} point
     * @return {Promise<void>}
     */
    async addPoint(point) {
        await this.setPoints(this._insertPointIntoArray(this._points, point));
    }

    /**
     * @param {Array<Point>} points
     * @param {Point} point
     * @return {Array<Point>}
     * @private
     */
    _insertPointIntoArray(points, point) {
        let updatedPoints = [];
        let inserted = false;
        for (const p of points) {
            if (p.startTime > point.startTime && !inserted) {
                updatedPoints.push(point);
                inserted = true;
            }
            updatedPoints.push(p);
        }
        if (!inserted) {
            updatedPoints.push(point);
        }
        return updatedPoints;
    }

    /**
     * @param {Point} point
     * @return {Promise<void>}
     */
    async removePoint(point) {
        await this.setPoints(this._removePointFromArray(this._points, point));
    }

    /**
     * @param {Array<Point>} points
     * @param {Point} point
     * @return {Array<Point>}
     * @private
     */
    _removePointFromArray(points, point) {
        return points.filter(p => p !== point);
    }

    /**
     * @return {Array<Point>}
     */
    getPoints() {
        return this._points;
    }

    /**
     * @param {Array<Point>} points
     * @return {Promise<void>}
     */
    async setPoints(points) {
        this._points = points;
        await this._renderPoints();
    }

    /**
     * @return {?Date}
     */
    getDefaultTimeOfNewPoint() {
        if (this._points.length === 0) return null;
        const point = this._points[this._points.length - 1];
        const endTime = this._addMinutesToDate(point.startTime, point.duration || 0);
        return this._getNearestUpcomingHour(endTime);
    }

    /**
     * @return {Promise<void>}
     * @private
     */
    async _renderPoints() {
        this._updatePointsNumbers();

        const renderId = ++this._renderId;
        this._clearRenderedPoints();
        this._resetSteps();

        for (const point of this._points) {
            if (this._renderId !== renderId) return;
            await this._renderNextPoint(point);
        }

        if (this._renderId !== renderId) return;
        this._mapSidebarRenderer.render(this.getSteps());
    }

    /**
     * @return {void}
     * @private
     */
    _updatePointsNumbers() {
        let lastNumber = 0;
        for (const point of this._points) {
            point.number = ++lastNumber;
        }
    }

    /**
     * @return {void}
     * @private
     */
    _clearRenderedPoints() {
        const oldRenderedPoints = this._renderedPoints;
        this._renderedPoints = [];

        for (const renderedPoint of oldRenderedPoints) {
            if (renderedPoint.marker !== null) {
                renderedPoint.marker.setMap(null);
            }

            if (renderedPoint.directionsRenderer !== null) {
                renderedPoint.directionsRenderer.setMap(null);
            }
        }
    }

    /**
     * @param {Point} point
     * @return {Promise<void>}
     */
    async _renderNextPoint(point) {
        const renderedPoint = new RenderedPoint(point);
        const previousRenderedPoint = this._renderedPoints.length ? this._renderedPoints[this._renderedPoints.length - 1] : null;
        this._renderedPoints.push(renderedPoint);
        this._resetSteps();
        this._renderMarker(renderedPoint);

        if (previousRenderedPoint !== null) {
            await this._renderDirections(previousRenderedPoint, renderedPoint);
        }
    }

    /**
     * @param {RenderedPoint} renderedPoint
     * @return {void}
     * @private
     */
    _renderMarker(renderedPoint) {
        const point = renderedPoint.point;
        renderedPoint.marker = new google.maps.Marker({
            position: point.latlng,
            label: point.number.toString(),
            map: this._map,
        });
    }

    /**
     * @param {RenderedPoint} startRenderedPoint
     * @param {RenderedPoint} endRenderedPoint
     * @return {Promise<void>}
     * @private
     */
    async _renderDirections(startRenderedPoint, endRenderedPoint) {
        const transitResult = await this._loadDirections(startRenderedPoint, endRenderedPoint, 'TRANSIT');
        const walkingResult = transitResult === null ? (await this._loadDirections(startRenderedPoint, endRenderedPoint, 'WALKING')) : null;

        if (transitResult !== null) {
            endRenderedPoint.directionsResult = transitResult;
            endRenderedPoint.directionsStatus = DirectionsStatus.Found;
        } else if (walkingResult !== null) {
            endRenderedPoint.directionsResult = walkingResult;
            endRenderedPoint.directionsStatus = DirectionsStatus.OnlyWalking;
        } else {
            endRenderedPoint.directionsResult = null;
            endRenderedPoint.directionsStatus = DirectionsStatus.NoRoute;
        }
        const result = endRenderedPoint.directionsResult;

        this._resetSteps();

        if (!this._renderedPoints.includes(startRenderedPoint) || !this._renderedPoints.includes(endRenderedPoint)) {
            return;
        }

        if (result !== null) {
            if (startRenderedPoint.endTime === null) {
                const originStartTime = startRenderedPoint.startTime;
                const destinationStartTime = endRenderedPoint.point.startTime;
                startRenderedPoint.endTime = this._getDirectionsDepartureTime(result, originStartTime, destinationStartTime);
            }
            const arrivalTime = this._getDirectionsArrivalTime(result, startRenderedPoint.endTime);
            endRenderedPoint.startTime = this._maxDate(endRenderedPoint.point.startTime, arrivalTime);
        }

        const renderer = new google.maps.DirectionsRenderer({
            preserveViewport: true,
            suppressMarkers: true,
            map: this._map,
        });
        endRenderedPoint.directionsRenderer = renderer;

        renderer.setDirections(result);
        this._fitBounds();
    }

    /**
     * @param {RenderedPoint} startRenderedPoint
     * @param {RenderedPoint} endRenderedPoint
     * @param {string} travelMode
     * @return {Promise<?object>}
     * @private
     */
    _loadDirections(startRenderedPoint, endRenderedPoint, travelMode) {
        return new Promise((resolve) => {
            const request = {
                origin: startRenderedPoint.point.latlng,
                destination: endRenderedPoint.point.latlng,
                travelMode: travelMode,
                transitOptions: this._buildTransitOptions(startRenderedPoint, endRenderedPoint),
            };

            this._directionsService.route(request, (result, status) => {
                resolve(status === 'OK' ? result : null);
            });
        });
    }

    /**
     * @param {RenderedPoint} startRenderedPoint
     * @param {RenderedPoint} endRenderedPoint
     * @return {object}
     * @private
     */
    _buildTransitOptions(startRenderedPoint, endRenderedPoint) {
        if (startRenderedPoint.endTime !== null) {
            return {
                departureTime: startRenderedPoint.endTime
            };
        } else {
            return {
                arrivalTime: endRenderedPoint.point.startTime,
            };
        }
    }

    /**
     * @param {object} result
     * @param {Date} originStartTime
     * @param {Date} destinationStartTime
     * @return {Date}
     * @private
     */
    _getDirectionsDepartureTime(result, originStartTime, destinationStartTime) {
        const leg = result['routes'][0]['legs'][0];
        if (leg['departure_time'] !== undefined) {
            return new Date(leg['departure_time']['value']);
        } else if (leg['duration'] !== undefined) {
            const durationInSeconds = leg['duration']['value'];
            const duration = this._secondsToMinutes(durationInSeconds);
            return this._maxDate(originStartTime, this._addMinutesToDate(destinationStartTime, -duration));
        }
    }

    /**
     * @param {object} result
     * @param {Date} previousEndTime
     * @return {Date}
     * @private
     */
    _getDirectionsArrivalTime(result, previousEndTime) {
        const leg = result['routes'][0]['legs'][0];
        if (leg['arrival_time'] !== undefined) {
            return new Date(leg['arrival_time']['value']);
        } else if (leg['duration'] !== undefined) {
            const durationInSeconds = leg['duration']['value'];
            const duration = Math.round(durationInSeconds / 60);
            return this._addMinutesToDate(previousEndTime, duration);
        }
    }

    /**
     * @param {Date} date1
     * @param {Date} date2
     * @return {Date}
     * @private
     */
    _maxDate(date1, date2) {
        if (date1 > date2) {
            return date1;
        } else {
            return date2;
        }
    }

    /**
     * @param {number} seconds
     * @return {number}
     * @private
     */
    _secondsToMinutes(seconds) {
        return Math.round(seconds / 60);
    }

    /**
     * @param {Date} date
     * @param {number} minutes
     * @return {Date}
     * @private
     */
    _addMinutesToDate(date, minutes) {
        return moment(date).add(minutes, 'minutes').toDate();
    }

    /**
     * @param {Date} date
     * @return {Date}
     * @private
     */
    _getNearestUpcomingHour(date) {
        return moment(date).set('minute', 0).set('second', 0).set('millisecond', 0).add(1, 'hour').toDate();
    }

    /**
     * @return {void}
     * @private
     */
    _fitBounds() {
        const bounds = this._calculateDirectionsBounds();
        if (bounds !== null) {
            this._map.fitBounds(bounds);
        }
    }

    /**
     * @return {?google.maps.LatLngBounds}
     * @private
     */
    _calculateDirectionsBounds() {
        const results = this._getPointsDirectionsResults();
        if (results.length === 0) return null;
        const latRange = this._combineRanges(results.map(result => this._getLatRange(result)));
        const longRange = this._combineRanges(results.map(result => this._getLongRange(result)));
        const sw = new google.maps.LatLng(latRange[0], longRange[0]);
        const ne = new google.maps.LatLng(latRange[1], longRange[1]);
        return new google.maps.LatLngBounds(sw, ne);
    }

    /**
     * @return {Array<object>}
     * @private
     */
    _getPointsDirectionsResults() {
        let results = [];
        for (const point of this._renderedPoints) {
            if (point.directionsResult !== null) {
                results.push(point.directionsResult);
            }
        }
        return results;
    }

    /**
     * @param {object} result
     * @return {Array<number>}
     * @private
     */
    _getLatRange(result) {
        const x = result['routes'][0]['bounds']['f'];
        return [x['b'], x['f']];
    }

    /**
     * @param {object} result
     * @return {Array<number>}
     * @private
     */
    _getLongRange(result) {
        const x = result['routes'][0]['bounds']['b'];
        return [x['b'], x['f']];
    }

    /**
     * @param {Array<Array<number>>} ranges
     * @return {Array<number>}
     * @private
     */
    _combineRanges(ranges) {
        let result = ranges[0];
        for (const range of ranges) {
            result[0] = Math.min(result[0], range[0]);
            result[1] = Math.max(result[1], range[1]);
        }
        return result;
    }

    /**
     * @return {Array<Step>}
     */
    getSteps() {
        if (this._steps === null) {
            this._steps = this._buildSteps();
        }
        return this._steps;
    }

    /**
     * @return {Array<Step>}
     */
    _buildSteps() {
        let steps = [];
        for (const renderedPoint of this._renderedPoints) {
            steps = steps.concat(this._buildPointSteps(renderedPoint));
        }
        return steps;
    }

    /**
     * @param {RenderedPoint} renderedPoint
     * @return {Array<Step>}
     * @private
     */
    _buildPointSteps(renderedPoint) {
        let steps = [];
        if (renderedPoint.directionsResult !== null) {
            steps = steps.concat(steps, this._buildPointDirectionsSteps(renderedPoint.directionsResult));
        }
        steps.push(this._buildPointStep(renderedPoint));
        return steps;
    }

    /**
     * @param {object} result
     * @return {Array<Step>}
     * @private
     */
    _buildPointDirectionsSteps(result) {
        let steps = [];
        for (const stepData of result['routes'][0]['legs'][0]['steps']) {
            const step = this._buildPointDirectionStep(stepData);
            if (step !== null) {
                steps.push(step);
            }
        }
        return steps;
    }

    /**
     * @param {object} stepData
     * @return {?Step}
     * @private
     */
    _buildPointDirectionStep(stepData) {
        const travelMode = stepData['travel_mode'];

        if (travelMode === 'WALKING') {
            const durationInSeconds = stepData['duration']['value'];
            const duration = this._secondsToMinutes(durationInSeconds);
            const distance = stepData['distance']['value']; // in meters

            return new Step(
                StepType.Walking,
                null,
                null,
                null,
                null,
                duration,
                distance,
                null,
                null
            );

        } else if (travelMode === 'TRANSIT') {
            const transitInfo = this._buildTransitInfo(stepData['transit']);
            const startTime = new Date(stepData['transit']['departure_time']['value']);
            const endTime = new Date(stepData['transit']['arrival_time']['value']);
            return new Step(
                StepType.Transit,
                null,
                transitInfo,
                startTime,
                endTime,
                null,
                null,
                null,
                null
            );
        }

        return null;
    }

    /**
     * @param {object} transitData
     * @return {TransitInfo}
     * @private
     */
    _buildTransitInfo(transitData) {
        return new TransitInfo(
            transitData['line']['vehicle']['type'],
            transitData['line']['short_name'],
            transitData['departure_stop']['name'],
            transitData['arrival_stop']['name'],
            transitData['headsign']
        );
    }

    /**
     * @param {RenderedPoint} renderedPoint
     * @return {Step}
     * @private
     */
    _buildPointStep(renderedPoint) {
        return new Step(
            StepType.Point,
            renderedPoint.point,
            null,
            renderedPoint.startTime,
            renderedPoint.endTime,
            null,
            null,
            renderedPoint.directionsStatus === DirectionsStatus.OnlyWalking,
            renderedPoint.directionsStatus === DirectionsStatus.NoRoute
        );
    }

    /**
     * @return {void}
     */
    _resetSteps() {
        this._steps = null;
    }
}

module.exports = MapControl;
