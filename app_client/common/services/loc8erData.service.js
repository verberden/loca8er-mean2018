(function () {
    angular
        .module('loc8erApp')
        .service('loc8erData', loc8erData);

    loc8erData.$inject = ['$http'];
    function loc8erData ($http) {
        var locationByCoords = function(lat, lng) {
            return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=7000');
        };

        var locationById = function(locationid) {
            return $http.get('/api/locations/' + locationid);
        }

        var addReviewById = function(locationid, data) {
            return $http.post('/api/locations/' + locationid + '/reviews', data);
        }

        return {
            locationByCoords: locationByCoords,
            locationById: locationById,
            addReviewById: addReviewById
        }
    }
})();