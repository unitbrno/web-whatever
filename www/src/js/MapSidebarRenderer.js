const StepType = require('./StepType');

class MapSidebarRenderer {
    /**
     * @param {MapControl} mapControl
     */
    setMapControl(mapControl) {
        this._mapControl = mapControl;
    }

    /**
     * @param {Array<Step>} steps
     * @return {void}
     */
    render(steps) {
        this._clearListItems();

        this._$lastRoutesContainer = null;
        this._lastRoutesContainerNumber = 0;

        for (const step of steps) {
            this._addListItem(step);
        }
    }

    /**
     * @return {void}
     * @private
     */
    _clearListItems() {
        const $sidebar = this._getSidebar();
        $sidebar.find('.places-list').empty();
    }

    /**
     * @param {Step} step
     * @return {void}
     * @private
     */
    _addListItem(step) {
        const $sidebar = this._getSidebar();

        if (step.type === StepType.Point) {
            const point = step.point;
            const $li = $sidebar.find('.list-item-template .point-template').clone();
            $li.find('.place-number').text(point.number);
            // TODO if step.delayed() - display warning
            $li.find('.place-time').text(this._formatTime(step.startTime));
            $li.find('.place-name').text(point.name);
            $li.find('.place-address').text(point.address);
            $li.find('.place-length').text(this._formatDuration(point.duration));

            // fix ID's in elements that are cloned
            const routesContainerId = 'routes-container-' + (++this._lastRoutesContainerNumber);
            $li.find('.routes-container').attr('id', routesContainerId);
            $li.find('.expand-routes-button').attr('href', '#' + routesContainerId);

            $li.find('.delete-button').on('click', (event) => {
                event.preventDefault();
                this._mapControl.removePoint(point);
            });

            $li.appendTo($sidebar.find('.places-list'));

            if (step.delayed) {
                $li.find('.warning-delayed').show();
            }

            if (step.noRouteWarning) {
                $li.find('.error-no-route').show();
            }

            if (step.walkingWarning) {
                $li.find('.error-walking').show();
            }

            this._$lastRoutesContainer = $li.find('.routes-container');

        } else if (step.type === StepType.Transit) {
            const $li = $sidebar.find('.list-item-template .transit-template').clone();
            $li.find('.place-time').text(this._formatTime(step.startTime));
            $li.find('.place-name').text(step.transitInfo.departureStop);
            $li.find('.place-address').text(step.transitInfo.headsign);
            $li.find('.place-length').text(this._formatDuration(step.durationInMinutes));
            $li.find('.mhd-number').text(step.transitInfo.lineNumber);

            if (step.transitInfo.vehicle === 'BUS') {
                $li.find('.vehicle-icon').text('directions_bus');
            }

            $li.appendTo(this._$lastRoutesContainer);

        } else if (step.type === StepType.Walking) {
            const $li = $sidebar.find('.list-item-template .walk-template').clone();
            // $li.find('.place-time').text(); // TODO
            $li.find('.place-name').text('Přesun pěši');
            $li.find('.place-address').text(step.walkingDistance + 'm');
            $li.find('.place-length').text(this._formatDuration(step.durationInMinutes));
            $li.appendTo(this._$lastRoutesContainer);
        }
    }

    /**
     * @return {jQuery}
     * @private
     */
    _getSidebar() {
        return $('#map-sidebar');
    }

    /**
     * @param {Date} time
     * @return {string}
     * @private
     */
    _formatTime(time) {
        return moment(time).format('H:mm');
    }

    /**
     * @param {?number} duration
     * @return {string}
     * @private
     */
    _formatDuration(duration) {
        if (duration === null) return '';
        const hours = Math.floor(duration / 60);
        const minutes = Math.floor(duration - hours * 60);
        return (hours ? (hours.toString() + ' h ') : '') + (minutes ? (minutes.toString() + ' m') : '');
    }
}

module.exports = MapSidebarRenderer;
