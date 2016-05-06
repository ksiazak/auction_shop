(function() {

    'use strict'

    angular.module('main')
    .directive('mainPage', function() {
        return {
            restrict: 'EA',
            templateUrl: '/static/fragments/main_page.html',
            controller: 'mainPageCtrl',
            controllerAs: 'mainPageCtrl'
        };
    });

})();