(function() {

    'use strict'

    angular.module('main')
    .factory('datepickerService', ['$http', function($http) {

        var self = this;
        self.date = new Date();

        self.options = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
          };

        var datepickerService = {
            'date': self.date,
            'options': self.options,
            'clear': clear,
            'toggleMin': toggleMin,
            'setDate': setDate,
        }

        return datepickerService;

        function clear(){
            self.date = null;
        };

        function toggleMin() {
            self.options.minDate = self.options.minDate ? null : new Date();
        };

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

        function setDate(year, month, day) {
            self.date = new Date(year, month, day);
        };

    }]);
})();