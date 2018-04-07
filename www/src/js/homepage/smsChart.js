$( function smsChart() {
    $('#sms-chart').highcharts({
        chart: {
            zoomType: 'none'
        },
		colors: "#e75c5c,#9159b8".split(","),
         title: {
            text: 'Last 7 days comparison',
			style: {
                color: "#4d575d",
                fontSize: "14px",
            },
        },
        xAxis: [{
            categories: ['3-7', '4-7', '5-7', '6-7', '7-7', '8-7', '9-7']
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'User Count',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Total Days',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
		legend: {
            enabled: !0,
            align: "right",
			layout: "horizontal",
            labelFormatter: function() {
                return this.name
            },
            borderColor: false,
            borderRadius: 0,
            navigation: {
                activeColor: "#274b6d",
                inactiveColor: "#CCC"
            },
            shadow: false,
            itemStyle: {
                color: "#888888",
                fontSize: "12px",
                fontWeight: "normal"
            },
            itemHoverStyle: {
                color: "#000"
            },
            itemHiddenStyle: {
                color: "#CCC"
            },
            itemCheckboxStyle: {
                position: "absolute",
                width: "12px",
                height: "12px"
            },
			symbolHeight: 10,
			symbolWidth: 10,
            symbolPadding: 5,
            verticalAlign: "bottom",
            x: 0,
            y: 0,
            title: {
                style: {
                    fontWeight: "normal"
                }
            }
        },

        tooltip: {
            shared: true,
			backgroundColor: '#ffffff',
			borderColor: '#f0f0f0',
			shadow: true
        },
		 credits: {
            enabled: false,
        },

        series: [{
            name: 'Total Days',
            type: 'spline',
            yAxis: 1,
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6],
            tooltip: {
                pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: '
            }
        }, {
            name: 'Total Days error',
            type: 'errorbar',
            yAxis: 1,
            data: [[48, 51], [68, 73], [92, 110], [128, 136], [140, 150], [171, 179], [135, 143]],
            tooltip: {
                pointFormat: '(error range: {point.low}-{point.high})<br/>'
            }
        }, {
            name: 'User Count',
            type: 'column',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2],
            tooltip: {
                pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f}</b> '
            }
        }, {
            name: 'User Count error',
            type: 'errorbar',
            data: [[6, 8], [5.9, 7.6], [9.4, 10.4], [14.1, 15.9], [18.0, 20.1], [21.0, 24.0], [23.2, 25.3]],
            tooltip: {
                pointFormat: '(error range: {point.low}-{point.high})<br/>'
            }
        }]
    });
});
