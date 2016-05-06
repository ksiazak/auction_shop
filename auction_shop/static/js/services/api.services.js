(function() {

    'use strict'

    angular.module('main')
    .factory('apiService', ['$http', function($http) {

        var self = this;

        var apiService = {
            'getData': getData,
        }

        return apiService;

        function getData(url){

            var promise = $http.get(url);
            return promise;
        }

    }]);
})();