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


    }]);
})();