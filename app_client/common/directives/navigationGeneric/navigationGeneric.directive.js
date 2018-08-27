(function () {
    angular
        .module('loc8erApp')
        .directive('navigationGeneric', navigationGeneric);

    function navigationGeneric() {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/navigationGeneric/navigationGeneric.template.html',
            controller: 'navigationCtrl as navvm'
        };
    };
})();