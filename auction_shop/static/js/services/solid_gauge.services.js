(function() {

    'use strict'

    angular.module('main')
    .factory('solidGaugeService', function() {

        var solidGaugeService = {
            'getConfig': getConfig,

        }

        return solidGaugeService;

        function getConfig(){
            return {
                options: {
                    chart: {
                        type: 'solidgauge'
                    },
                    pane: {
                        center: ['50%', '80%'],
                        size: '130%',
                        startAngle: -90,
                        endAngle: 90,
                        background: {
                            backgroundColor:'#EEE',
                            innerRadius: '60%',
                            outerRadius: '100%',
                            shape: 'arc'
                        }
                    },
                    solidgauge: {
                        dataLabels: {
                            y: 0,
                            borderWidth: 0,
                            useHTML: true
                        }
                    },
                    tooltip: {
                        enabled: false,
                    },
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '<div style="text-align:center"><span style="font-size:16px;color:black">{y}</span>  ' +
                        '<br><span style="font-size:14px;color:silver;">%</span></div>'
                    }
                }],
                title: {
                    text: ""
                },
                yAxis: {
                    currentMin: 0,
                    currentMax: 100,
                    title: {
                        y: 20
                    },
                    stops: [
                        [0.1, '#55BF3B'], // red
                        [0.5, '#DDDF0D'], // yellow
                        [0.9, '#DF5353'] // green
                    ],
                    lineWidth: 0,
                    tickInterval: 20,
                    tickPixelInterval: 400,
                    tickWidth: 0,
                    labels: {
                        y: 10
                    }
                },
                size: {
                    width: 300,
                    height: 200
                },
                loading: false
            }
        }

    });
})();