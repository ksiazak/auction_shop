(function() {

    'use strict'

    angular.module('main')
    .controller('nodesListCtrl',
        ['$scope', 'solidGaugeService', 'nodesWebSocketService', 'apiService', '$interval',
         'notificationService',
        function($scope, solidGaugeService, ws, apiService, $interval, notificationService) {

        var self = this;
        self.nodes = [];
        self.masterActivity = false;

        var inactiveStatus = { 'active': false,
                               'color': 'danger',
                               'glyphicon': 'times'};

        var disableNodesWhenMasterIsInactive = function(){
            if (!self.masterActivity){
                self.nodes.forEach(function(node){
                    if (node.status)
                    {
                        if (node.status.active){
                            node.status = angular.copy(inactiveStatus);
                            notificationService.errorNotification(node);
                        }
                    }
                    else {
                        node.status = angular.copy(inactiveStatus);
                    }
                });
            }
            self.masterActivity = false;
        }

        $interval(disableNodesWhenMasterIsInactive, 3000);


        var initWithSolidGaugeConfig = function(node){
            node.cpu1UsageConfig = angular.copy(solidGaugeService.getConfig());
            node.cpu2UsageConfig = angular.copy(solidGaugeService.getConfig());
            node.cpu3UsageConfig = angular.copy(solidGaugeService.getConfig());
            node.cpu4UsageConfig = angular.copy(solidGaugeService.getConfig());
            node.ramUsageConfig = angular.copy(solidGaugeService.getConfig());
            node.swapUsageConfig = angular.copy(solidGaugeService.getConfig());
            node.show_details = false;
            node.type == 'Master' ? node.typeIcon = 'king' : node.typeIcon = 'knight';
        }

        var onCreateSubscribeForGettingHwStats = function(args){
            var updateHwData = function(node){
                var getNodeByName = function(value){ return value[0] == node.name; }
                var nodeData = args.find(getNodeByName);
                if (nodeData){
                    node.cpu1UsageConfig.series[0].data = [nodeData[1]];
                    node.cpu2UsageConfig.series[0].data = [nodeData[2]];
                    node.cpu3UsageConfig.series[0].data = [nodeData[3]];
                    node.cpu4UsageConfig.series[0].data = [nodeData[4]];
                    node.ramUsageConfig.series[0].data = [nodeData[5]];
                    node.swapUsageConfig.series[0].data = [nodeData[6]];
                    if (node.status.active != true){
                        notificationService.successNotification(node);
                    }
                    node.status = { 'active': true,
                                    'color': 'success',
                                    'glyphicon': 'check'};
                }
                else {
                    if (node.status.active != false){
                        notificationService.errorNotification(node);
                    }
                    node.status = { 'active': false,
                                    'color': 'danger',
                                    'glyphicon': 'times'};
                }
                $scope.$apply();
            }
            self.nodes.forEach(updateHwData);
            self.masterActivity = true;
        }

        var onCreateSubscribeForGettingNewNodes = function(args){
            var newNodeData = args;
            var newNode = {};
            if (newNodeData){
                for (var i = 0; i < newNodeData.length; i += 2){
                    newNode[newNodeData[i]] = newNodeData[i + 1];
                }
            }
            initWithSolidGaugeConfig(newNode);
            self.nodes.push(newNode);
            $scope.$apply();
            notificationService.infoNotification(newNode);
        }

        apiService.getData('/api/nodes/').then(function(response){
            self.nodes = response.data.results;
            self.nodes.forEach(initWithSolidGaugeConfig);
            ws.establishConnection(onCreateSubscribeForGettingHwStats,
                                   onCreateSubscribeForGettingNewNodes);
        });

        self.resetNode = function(node){
            node.show_details=!node.show_details;
            swal({
                title: node.name,
                text: "Are you sure that you want to reset the node?",
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
                    swal(node.name, "Reset performed.", "success");
                } else {
                    swal(node.name, "Reset cancelled.", "error");
                }
            });
        }

    }]);

    angular.module('main')
    .controller('nodesItemCtrl', ['$scope',
        function($scope) {

        var self = this;
        self.node = $scope.node;

    }]);
})();