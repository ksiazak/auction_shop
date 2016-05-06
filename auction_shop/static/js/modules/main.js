(function() {

    'use strict'

    var main = angular.module('main', ['highcharts-ng', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate',
                                       'atomic-notify'])
                      .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
                        cfpLoadingBarProvider.latencyThreshold = 10;
                      }])
                      .config(['atomicNotifyProvider', function(atomicNotifyProvider){
                          atomicNotifyProvider.setDefaultDelay(5000);
                          atomicNotifyProvider.useIconOnNotification(true);
                      }])
})();