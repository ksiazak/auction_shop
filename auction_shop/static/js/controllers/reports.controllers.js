(function() {

    'use strict'

    angular.module('main')
    .controller('reportsCtrl', ['$scope', 'apiService', function($scope, apiService) {

        var self = this;

        $scope.chartConfig = {
            "options": {
                "chart": {
                    "type": "pie"
                },
                "plotOptions": {
                    "series": {
                        "stacking": ""
                    }
                }
            },
            "series": [
                {
                    "data": [0, 0, 0, 0],
                    "id": "series-4",
                    "name": "Liczba aukcji",
                    "type": "bar"
                }
            ],
            "xAxis": {
                "categories": []
            },
            "title": {
                "text": "Liczba aukcji danego typu"
            },
            "credits": {
                "enabled": false
            },
            "loading": false,
            "size": {}
        };

        $scope.doubleColumnChartConfig = {
          "options": {
            "chart": {
              "type": "column"
            },
            "plotOptions": {
              "series": {
                "stacking": ""
              }
            }
          },
          "series": [
            {
              "name": "Wystawione",
              "data": [
                0
              ],
              "connectNulls": true,
              "id": "series-1",
              "color": "red"
            },
            {
              "data": [
                0
              ],
              "id": "series-4",
              "name": "Nabyte",
              "color": "green"
            }
          ],
          "xAxis": {
                "categories": []
          },
          "title": {
            "text": "Ilość nabytych i sprzedanych przedmiotów dla danych uzytkowników"
          },
          "credits": {
            "enabled": false
          },
          "loading": false,
          "size": {}
        };

        $scope.smoothLineChartConfig = {
          "options": {
            "chart": {
              "type": "spline"
            },
            "plotOptions": {
              "series": {
                "stacking": ""
              }
            }
          },
          "series": [],
          "xAxis": {
                "categories": []
          },
          "title": {
            "text": "Średnia wartość ceny przedmiotów wystawionych danego dnia na aukcję 'Kup teraz!' w ciągu ostatnich 30 dni"
          },
          "credits": {
            "enabled": false
          },
          "loading": false,
          "size": {}
        }

        apiService.getData('/auction_types_number/').then(function(response){
            var data = [];
            var types = [];
            for (var type in response.data){
                data.push(response.data[type]);
                types.push(type);
            };
            $scope.chartConfig.series[0].data = data;
            $scope.chartConfig.xAxis.categories = types;
        });

        apiService.getData('/items_saldo_per_user/').then(function(response){
            var sold = [];
            var bought = [];
            var users = [];
            for (var user in response.data){
                sold.push(response.data[user][0]);
                bought.push(response.data[user][1]);
                users.push(user);
            };
            $scope.doubleColumnChartConfig.series[0].data = sold;
            $scope.doubleColumnChartConfig.series[1].data = bought;
            $scope.doubleColumnChartConfig.xAxis.categories = users;
        });

        apiService.getData('/items_price_in_time/').then(function(response){
            var dates = [];
            var areSeriesAdded = false;
            for (var date in response.data){
                dates.push(date);
                var seriesNumber = 0;
                for (var user in response.data[date]){
                    if (!areSeriesAdded){
                        $scope.smoothLineChartConfig.series.push({
                                                                  "data": [],
                                                                  "id": user,
                                                                  "name": user,
                                                                  });
                    }
                    var result = 0;
                    if (response.data[date][user]['cena_minimalna__avg']){
                        result = response.data[date][user]['cena_minimalna__avg'];
                    }
                    $scope.smoothLineChartConfig.series[seriesNumber].data.push(result);
                    ++seriesNumber;
                }
                areSeriesAdded = true;
            }
            $scope.smoothLineChartConfig.xAxis.categories = dates;
        });

    }]);
})();