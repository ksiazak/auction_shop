(function() {

    'use strict'

    angular.module('main')
    .directive('auctionsList', function() {
        return {
            restrict: 'EA',
            templateUrl: '/static/fragments/auctions_list.html',
            scope: {
                'path': '@'
            },
            controller: 'auctionsListCtrl',
            controllerAs: 'auctionsListCtrl'
        };
    });

    angular.module('main')
    .directive('auctionsItem', function() {
        return {
            restrict: 'EA',
            templateUrl: '/static/fragments/auctions_item.html',
            scope: {
                auction: '='
            },
            controller: 'auctionsItemCtrl',
            controllerAs: 'auctionsItemCtrl'
        };
    });

})();