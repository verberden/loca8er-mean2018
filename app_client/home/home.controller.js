(function () {
    angular
        .module('loc8erApp')
        .controller('homeCtrl', homeCtrl)

    homeCtrl.$inject = ['$scope', 'loc8erData', 'geolocation'];
    function homeCtrl ($scope, loc8erData, geolocation) {
        var vm = this;
        vm.pageHeader = {
            title: 'Loc8er',
            strapline: "Find places to work with wifi near you!"
        };
        vm.sidebar = {
            content: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
        };
        vm.message = "Checking your location";

        vm.getData = function(position) {
            var lat = position.coords.latitude,
                lng = position.coords.longitude;

            vm.message = "Searching for nearby places";
            loc8erData.locationByCoords(lat, lng)
                .success(function(data) {
                    vm.message = data.length > 0 ? '' : "No locations found";
                    vm.data = { locations: data };
                })
                .error(function(e) {
                    vm.message = "Sorry, something's gone wrong ";
                });
        };

        vm.showError = function(error) {
            $scope.$apply(function() {
                vm.message = error.message;
            })
        };

        vm.noGeo = function() {
            $scope.$apply(function() {
                vm.message = "Geolocation not supported in this browser.";
            })
        };

        geolocation.getPosition(vm.getData, vm.showError, vm.noGeo);
    }
})();