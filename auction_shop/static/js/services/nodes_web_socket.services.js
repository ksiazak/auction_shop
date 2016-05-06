(function() {

    'use strict'

    angular.module('main')
    .factory('nodesWebSocketService', nodesWebSocketService);

    function nodesWebSocketService() {

        var self = this;

        self.connection = null;
        self._onCreateSubsribeForGettingHw = function(){}
        self._onCreateSubsribeForGettingNewNodes = function(){}

        var nodesWebSocketService = {
            'establishConnection': establishConnection,
            'subscribe': subscribe,
            'unsubscribe': unsubscribe,
            'publish': publish
        }

        return nodesWebSocketService;

        function establishConnection(onCreateSubsribeForGettingHw, onCreateSubsribeForGettingNewNodes) {

            self.connection = new autobahn.Connection({
                url: 'ws://klasterjanusz.ddns.net:8080/ws',
                realm: 'realm1'
            });
            self._onCreateSubsribeForGettingHw = onCreateSubsribeForGettingHw;
            self._onCreateSubsribeForGettingNewNodes = onCreateSubsribeForGettingNewNodes;
            self.connection.onopen = _subscribeCreate;
            self.connection.open();
            return self.connection;
        }

        function subscribe(topic, onPublish) {
            if (!self.connection.isOpen) {
                throw "[ERROR] JANUSZ WebSocket connection: cannot subscribe since connection is closed.";
            }

            self.connection.session
                .subscribe(topic, onPublish)
                .then(_subscribeSuccess, _subscribeFailure);
        }

        function unsubscribe(request_pk) {
//            var topic = 'qgp.scbt.'+request_pk;
//            var subscription = null;
//            for (var key in self.connection.session.subscriptions) {
//                if (self.connection.session.subscriptions[key][0].topic == topic) {
//                    subscription = self.connection.session.subscriptions[key][0];
//                    break;
//                }
//            }
//            self.connection.session.unsubscribe(subscription);
        }

        function publish(request) {
//            request = angular.copy(request);
//            delete request.expanded;
//            delete request.links;
//            delete request.readonly;
//            self.connection.session.publish('qgp.scbt.'+request.pk, [request]);
        }

        function _subscribeCreate(session) {
            if (!self.connection.isOpen) {
                throw "[ERROR] JANUSZ WebSocket connection: cannot subscribe since connection is closed.";
            }

            session.subscribe('hw_data', self._onCreateSubsribeForGettingHw)
                .then(_subscribeSuccess, _subscribeFailure);
            session.subscribe('new_node', self._onCreateSubsribeForGettingNewNodes)
                .then(_subscribeSuccess, _subscribeFailure);

        }

        function _subscribeSuccess(subscription) {
            console.log("Subscribe successful: ", subscription);
        }

        function _subscribeFailure(error) {
            console.log("Subscribe failed: ", error);
        }

    }
})();