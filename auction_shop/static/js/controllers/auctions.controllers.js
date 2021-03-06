(function() {

    'use strict'

    angular.module('main')
    .controller('auctionsListCtrl',
        ['$scope', '$window', 'apiService', 'notificationService',
        function($scope, $window, apiService, notificationService) {

        var self = this;
        self.isLoading = true;
        self.auctions = [];
        self.filterUrl = $scope.path
        self.showFilters = false;
        self.orderingField = "";
        self.orderingType = "";
        self.orderingTypes = ['rosnąco', 'malejąco'];
        self.filteringField = "";
        self.filteringType = "";
        self.filteringTypes = ['równy', 'zawiera'];
        self.filteringValue = "";

        apiService.getData('/api/aukcje' + self.filterUrl).then(function(response){
            self.auctions = response.data.results;
            self.ordering = response.data.ordering;
            self.filters = response.data.filters;
            self.bigTotalItems = response.data.count;
            self.currentPage = response.data.next;
            self.isLoading = false;
        });

        self.executeFilteringOrdering = function(){
            var redirectUrl = '/?';
            if (self.orderingField){
                redirectUrl += 'ordering=';
                if (self.orderingType == 'malejąco'){
                    redirectUrl += '-';
                }
                redirectUrl += self.orderingField;
            }
            if (self.filteringField){
                if (self.orderingField){
                    redirectUrl += '&';
                }
                if (self.filteringType == 'równy'){
                    redirectUrl += self.filteringField + '=' + self.filteringValue;
                }
                else if (self.filteringType == 'zawiera'){
                    redirectUrl += self.filteringField + '_contains=' + self.filteringValue;
                }
            }
            $window.location.href = redirectUrl;
        };

    }]);

    angular.module('main')
    .controller('auctionsItemCtrl', ['$scope', '$sce', '$http',
        function($scope, $sce, $http) {

        var self = this;
        self.auction = $scope.auction;
        self.item = self.auction.item;
        self.description = $sce.trustAsHtml(self.auction.item.description);
        self.images = [
            {thumb: self.item.image_url, img: self.item.image_url, description: self.item.name},
        ];

        self.removeItem = function(){
            swal({
                title: self.auction.item.name,
                text: "Na pewno chcesz usunąć ten przedmiot?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Tak",
                cancelButtonText: "Nie",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm){
                if (isConfirm) {
                    $http({
                        url: 'remove_item/',
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
                        self.auction.buyer.username = "Usunięto.";
                        swal(self.auction.item.name, "Przedmiot został usuniety.", "success");
                    },
                    function(response) {
                        swal(self.auction.item.name, "Wystąpiły problemy.", "error");
                    });
                } else {
                    swal(self.auction.item.name, "Anulowano.", "error");
                }
            });
        }

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
                        self.auction.buyer.username = response.data.buyer;
                        swal(self.auction.item.name, "Przedmiot został kupiony.", "success");
                    },
                    function(response) {
                        swal(self.auction.item.name, "Wystąpiły problemy.", "error");
                    });
                } else {
                    swal(self.auction.item.name, "Anulowano.", "error");
                }
            });
        }
    }]);

    angular.module('main')
    .controller('newAuctionCtrl',
        ['$scope', '$http', 'apiService', 'datepickerService',
        function($scope, $http, apiService, datepickerService) {
        var self = this;
        self.newAuctionData = {
            'item': {
                        'name': '',
                        'state': '',
                        'category': '',
                        'description': '',
                        'imageSource': ''
                    },
            'auction': {
                        'type': '',
                        'minPrice': '',
                        'finishDate': ''
            }
        };
        self.newAuctionData.auction.finishDate = datepickerService.date;

        apiService.getData('/api/categories/').then(function(response){
            self.categories = response.data.results;
        });

        apiService.getData('/api/states/').then(function(response){
            self.states = response.data.results;
        });

        apiService.getData('/api/auction_types/').then(function(response){
            self.types = response.data.results;
        });

        self.createNewAuction = function(){
            console.log(self.newAuctionData);
            swal({
                title: self.newAuctionData.item.name,
                text: "Stworzyć aukcję z tym przedmiotem?",
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
                        url: 'create_auction/',
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'newAuction': self.newAuctionData
                        }
                    })
                    .then(function(response) {
                        swal(self.newAuctionData.item.name, "Stworzono aukcję.", "success");
                    },
                    function(response) {
                        swal(self.newAuctionData.item.name, "Wystąpiły problemy.", "error");
                    });
                } else {
                    swal(self.newAuctionData.item.name, "Anulowano.", "error");
                }
            });
        };

        datepickerService.toggleMin();


    }]);
})();