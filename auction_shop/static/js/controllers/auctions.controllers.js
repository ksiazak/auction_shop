(function() {

    'use strict'

    angular.module('main')
    .controller('auctionsListCtrl',
        ['$scope', '$location', 'apiService', 'notificationService',
        function($scope, $location, apiService, notificationService) {

        var self = this;
        self.auctions = [];
        self.filterUrl = $scope.path

//        self.bigCurrentPage = 1;
//        self.currentPage = 1;
//        self.maxSize = 5;

        apiService.getData('/api/aukcje' + self.filterUrl).then(function(response){
            self.auctions = response.data.results;
            self.bigTotalItems = response.data.count;
            self.currentPage = response.data.next;
            console.log(response);
        });

//        $scope.$watch('auctionsListCtrl.bigCurrentPage', function(){
//            if (self.currentPage != self.bigCurrentPage){
//                var currentUrl = window.location.href;
//                var pagePos = currentUrl.search('page=');
//                currentUrl[pagePos]
//
//                window.location.replace(window.location.href);
//            }
//        })



    }]);

    angular.module('main')
    .controller('auctionsItemCtrl', ['$scope',
        function($scope) {

        var self = this;
        self.auction = $scope.auction;
        self.item = self.auction.item;

    }]);
})();