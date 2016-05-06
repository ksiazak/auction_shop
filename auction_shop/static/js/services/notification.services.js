(function() {

    'use strict'

    angular.module('main')
    .factory('notificationService', ['atomicNotifyService', function(atomicNotifyService) {

        var self = this;

        var notificationService = {
            'infoNotification': infoNotification,
            'successNotification': successNotification,
            'errorNotification': errorNotification,
        }

        return notificationService;

        function infoNotification(node){
            atomicNotifyService.info(node.name + ' has been added.');
        };

        function successNotification(node){
            atomicNotifyService.success(node.name + ' is active.');
        };

        function errorNotification(node){
            atomicNotifyService.error(node.name + ' is inactive.');
        };

    }]);
})();