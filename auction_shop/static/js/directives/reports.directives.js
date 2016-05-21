(function() {

    'use strict'

    angular.module('main')
    .directive('reports', function() {
        return {
            restrict: 'EA',
            templateUrl: '/static/fragments/reports.html',
            controller: 'reportsCtrl',
            controllerAs: 'reportsCtrl'
        };
    });

})();