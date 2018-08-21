(function () {
    angular
        .module('loc8erApp')
        .service('loc8erData', loc8erData);

    loc8erData.$inject = ['$http'];
    function loc8erData ($http) {
        var locationByCoords = function(lat, lng) {
            return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=7000');
        };

        return {
            locationByCoords: locationByCoords
        }
    }
})();