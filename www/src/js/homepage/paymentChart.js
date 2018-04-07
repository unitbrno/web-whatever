$(function paymentChart(){
    $('#payment-chart').highcharts({
        chart: {
            type: 'column'
        },
		colors: "#00719d,#2ab7ee".split(","),
        title: {
            text: 'Last 10 days comparison',
			style: {
                color: "#4d575d",
                fontSize: "14px",
            },
        },
        xAxis: {
            categories: ['9-7', '10-7', '11-7', '12-7', '13-7', '14-7', '15-7', '16-7', '17-7', '18-7']
        },
        yAxis: {
            min: 0,
			title: {
					text: "Amount"
			},
			stackLabels: {
					enabled: false,
					style: {
						fontWeight: 'bold',
						color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
					}
				}
			},
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
                position: "absolute"
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
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
			backgroundColor: '#ffffff',
			borderColor: '#f0f0f0',
			shadow: true
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
		 credits: {
            enabled: false,
        },
        series: [{
            name: 'Card',
            data: [25000, 50000, 75000, 75000, 60000, 70000, 10000, 2500, 5000, 25000]
        }, {
            name: 'Wallet',
            data: [75000, 50000, 25000, 25000, 30000, 30000, 90000, 25000, 3000, 50000]
        }]

    });
});
