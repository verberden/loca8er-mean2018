(function () {
    angular.module('loc8erApp', ['ngRoute']);

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});
    }

    angular
        .module('loc8erApp')
        .config(['$routeProvider', config]);
})();