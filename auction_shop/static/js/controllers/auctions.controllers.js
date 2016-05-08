(function() {

    'use strict'

    angular.module('main')
    .controller('auctionsListCtrl',
        ['$scope', '$location', 'apiService', 'notificationService',
        function($scope, $location, apiService, notificationService) {

        var self = this;
        self.auctions = [];
        self.filterUrl = $scope.path

        apiService.getData('/api/aukcje' + self.filterUrl).then(function(response){
            self.auctions = response.data.results;
        });




    }]);

    angular.module('main')
    .controller('auctionsItemCtrl', ['$scope',
        function($scope) {

        var self = this;
        self.auction = $scope.auction;
        console.log(self.auction.item.description);

    }]);
})();