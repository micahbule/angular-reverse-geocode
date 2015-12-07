/**
 * AngularJS reverse geocoding directive
 * @author Jason Watmore <jason@pointblankdevelopment.com.au> (http://jasonwatmore.com)
 * @version 1.0.0
 */
(function () {
    angular.module('angularReverseGeocode', [])
    .directive('reverseGeocode', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                lat: '=',
                lng: '=',
                mapApiPromise: '=?'
            },
            link: function (scope, element) {
                if (!scope.mapApiPromise) return watchLatLng();

                scope.mapApiPromise.then(function (maps) {
                    watchLatLng(maps);
                });

                function watchLatLng(mapApi) {
                    var mapsApi = mapApi || google.maps;

                    scope.$watchGroup(['lat', 'lng'], function () {
                        var geocoder = new mapsApi.Geocoder();
                        var latlng = new mapsApi.LatLng(scope.lat, scope.lng);
                        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[1]) {
                                    element.text(results[1].formatted_address);
                                } else {
                                    element.text('Location not found');
                                }
                            } else {
                                element.text('Geocoder failed due to: ' + status);
                            }
                        });
                    });
                }
            },
            replace: true
        }
    });
})();