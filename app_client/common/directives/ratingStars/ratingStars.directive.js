(function () {
    angular
        .module('loc8erApp')
        .directive('ratingStars', ratingStars);

    function ratingStars() {
        return {
            restrict: 'EA',
            scope: {
                thisRating: '=ratingNum'
            },
            templateUrl: '/common/directives/ratingStars/ratingStars.template.html'
        };
    };
})();