const Point = require('./Point');

class PlanningPage {
    /**
     * @param {MapControl} mapControl
     * @param {CreatePointForm} createPointForm
     */
    constructor(mapControl, createPointForm) {
        this._mapControl = mapControl;
        this._createPointForm = createPointForm;
    }

    async init() {
        await this._mapControl.init();
        await this._createPointForm.init();
        this._createPointForm.register();

        await this._mapControl.loadFirstPointFromUrl();
        this._initializeResponsivity();
        this._initializeSuggestions();
    }

    /**
     * @return {void}
     * @private
     */
    _initializeResponsivity() {
        function placesHeight(mh) {
            const wh = $(window).height();
            const bh = $(".action-buttons").outerHeight();
            const ch = $(".collapse-buttons").outerHeight();
            $(".places-list").css({
                height: wh - bh - ch - mh
            })
        }
        placesHeight(0);

        function mobilePlanning() {
            $(".planning-page-container").removeClass("container-fluid");
            $(".planning-page-container div.row").addClass("tab-content").removeClass("row");
            $(".planning-page-container .reset-padding").addClass("tab-pane");
            $("#map-sidebar").addClass("active");
            $(".pmd-tabs").removeClass("invisible");
            // $('.pmd-tabs').pmdTab();
            placesHeight($('.pmd-tabs').outerHeight());
        }

        function desktopPlanning() {
            $(".planning-page-container").addClass("container-fluid");
            $(".pmd-tabs").addClass("invisible");
            $(".planning-page-container div.tab-content").addClass("row").removeClass("tab-content");
            $(".planning-page-container .reset-padding").removeClass("tab-pane");
            $("#map-sidebar").removeClass("active");
            placesHeight(0);

        }

        if ($(window).width() < 992 ) {
            mobilePlanning();
        }

        $(window).resize(function () {
            placesHeight();

            if ($(window).width() < 992) {
                mobilePlanning();
            } else {
                desktopPlanning();
            }
        });
    }

    _initializeSuggestions() {

        $(".select-add-tags").select2({
            tags: true,
            theme: "bootstrap"
        });

        $(".select-add-tags").on("change", function (e) {
            $("#places-sug li").remove();

            var categories = $(".select-add-tags").val();
            $.each( categories, function( i, item ) {
                console.log(this);
                loadSuggestedPlaces(this);
            });

        });



        var sApiKey = 'AIzaSyAd9DDezYX8e8Bmd5kbY1ElMNDyrQt9pGs';
        var sLat = '49.2258174';
        var sLng = '16.5857261';
        var sRadius = '500';

        //var categories = new Array();
        // categories.push(["restaurant", "food", "meal_takeaway"]);
        // categories.push(["art_gallery", "movie_theater", "museum", "zoo"]);
        // categories.push(["bar", "cafe", "night_club"]);
        // categories.push(["park", "spa", "gym", "stadium"]);
        // categories.push(["clothing_store", "department_store", "shoe_store", "shopping_mall", "supermarket", "bakery"]);
        // categories.push(["pharmacy", "florist", "post_office", "church"]);
        // console.log(JSON.stringify(categories[0]));

        //console.log(obj);
        //"types" : [ "restaurant", "food", "establishment" ],

        function loadSuggestedPlaces(category) {
            var mapsAPI = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+sLat+','+sLng+'&radius='+sRadius+'&type='+category+'&key='+sApiKey;

            $.getJSON( mapsAPI )
                .done(function( data ) {
                    //console.log(data);

                    $.each( data.results, function( i, item ) {

                        if(item.photos && item.rating){
                            var photoAPI ='https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+item.photos[0].photo_reference+'&key='+sApiKey;

                            var template = '<li>' +
                                '<a href="#" class="single-suggestion" data-target="#add-place" data-toggle="modal">' +
                                '<div class="place-thumb-img" style="background-image: url('+photoAPI+')">' +
                                '<img class="place-type" src="'+item.icon+'" alt="">' +
                                '<div class="place-thumb-info">' +
                                '<p class="place-name">'+item.name+'</p>' +
                                '<span class="place-rating">'+item.rating+'</span></div> </div> </a> </li>';

                            $("#places-sug").prepend(template);
                        }
                    });
                });
        }

        loadSuggestedPlaces('bar');

        $(document).delegate('.single-suggestion','click', (event, x) => {
            const $suggestion = $(event.target).closest('.single-suggestion');
            this._createPointForm.open($suggestion.find('.place-name').text());
        });
    }
}

module.exports = PlanningPage;
