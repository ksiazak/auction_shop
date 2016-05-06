(function() {

    'use strict'

    angular.module('main')
    .directive('solidGauge', function() {
        return {
            restrict: 'EA',
            templateUrl: '/static/fragments/solid_gauge.html',
            scope: {
                type: '@',
                icon: '@',
                text: '@',
                role: '@',
                id: '@',
                config: '='
            }
        };
    });

})();