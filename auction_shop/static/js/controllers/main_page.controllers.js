(function() {

    'use strict'

    angular.module('main')
    .controller('mainPageCtrl', ['$scope', function($scope) {

        var self = this;

        self.path = $scope.path;

    }]);

})();