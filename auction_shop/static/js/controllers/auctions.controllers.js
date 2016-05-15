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
        ['$scope', '$http', 'apiService',
        function($scope, $http, apiService) {
        var self = this;
        self.newAuctionData = {
            'item': {
                        'name': '',
                        'state': '',
                        'category': '',
                        'categoryFeatures': '',
                        'desription': '',
                        'image': ''


                    },
            'auction': {
                        'type': '',

            }
        };

        apiService.getData('/api/categories/').then(function(response){
            self.categories = response.data.results;
        });

        apiService.getData('/api/states/').then(function(response){
            self.states = response.data.results;
        });

        apiService.getData('/api/auction_types/').then(function(response){
            self.types = response.data.results;
        });

        $scope.today = function() {
            $scope.dt = new Date();
          };
          $scope.today();

          $scope.clear = function() {
            $scope.dt = null;
          };

          $scope.options = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
          };

          // Disable weekend selection
          function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
          }

          $scope.toggleMin = function() {
            $scope.options.minDate = $scope.options.minDate ? null : new Date();
          };

          $scope.toggleMin();

          $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
          };

          var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          var afterTomorrow = new Date(tomorrow);
          afterTomorrow.setDate(tomorrow.getDate() + 1);
          $scope.events = [
            {
              date: tomorrow,
              status: 'full'
            },
            {
              date: afterTomorrow,
              status: 'partially'
            }
          ];

          function getDayClass(data) {
            var date = data.date,
              mode = data.mode;
            if (mode === 'day') {
              var dayToCheck = new Date(date).setHours(0,0,0,0);

              for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                  return $scope.events[i].status;
                }
              }
            }

            return '';
          }


    }]);
})();