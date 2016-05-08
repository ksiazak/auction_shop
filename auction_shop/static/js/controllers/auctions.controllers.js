(function() {

    'use strict'

    angular.module('main')
    .controller('auctionsListCtrl',
        ['$scope', '$location', 'apiService', 'notificationService',
        function($scope, $location, apiService, notificationService) {

        var self = this;
        self.isLoading = true;
        self.auctions = [];
        self.filterUrl = $scope.path

//        self.bigCurrentPage = 1;
//        self.currentPage = 1;
//        self.maxSize = 5;

        apiService.getData('/api/aukcje' + self.filterUrl).then(function(response){
            self.auctions = response.data.results;
            self.bigTotalItems = response.data.count;
            self.currentPage = response.data.next;
            self.isLoading = false;
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
        self.images = [
            {thumb: self.item.image_url, img: self.item.image_url, description: self.item.name},
        ];

    }]);

    angular.module('main')
    .controller('auctionActionBuyCtrl', ['$scope', '$http',
        function($scope, $http) {

        var self = this;
        self.auction = $scope.auction;

        self.buyItem = function(){
            swal({
                title: self.auction.item.name,
                text: "Are you sure that you want to buy this item?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm){
                if (isConfirm) {
                    $http({
                        url: 'buy_item/',
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'auction_id': self.auction.id
                        }
                    })
                    .then(function(response) {
                        self.auction.if_finished = true;
                        self.auction.show_details = false;
                        swal(self.auction.item.name, "Item has been bought.", "success");
                    },
                    function(response) {
                        swal(self.auction.item.name, "There were problems.", "error");
                    });
                } else {
                    swal(self.auction.item.name, "Cancelled.", "error");
                }
            });

        }


    }]);
})();