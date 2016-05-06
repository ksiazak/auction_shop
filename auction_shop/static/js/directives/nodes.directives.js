(function() {

    'use strict'

    angular.module('main')
    .directive('nodesList', function() {
        return {
            restrict: 'EA',
            templateUrl: '/static/fragments/nodes_list.html',
            controller: 'nodesListCtrl',
            controllerAs: 'nodesListCtrl'
        };
    });

    angular.module('main')
    .directive('nodesItem', function() {
        return {
            restrict: 'EA',
            templateUrl: '/static/fragments/nodes_item.html',
            scope: {
                node: '='
            },
            controller: 'nodesItemCtrl',
            controllerAs: 'nodesItemCtrl'
        };
    });

})();