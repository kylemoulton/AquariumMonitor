function createChart(chemParameter, chemUnits, readings) {
    var dataPoints = [];
    readings.forEach(function(reading) {
       dataPoints.push({x: reading.date, y: reading[chemParameter]}); 
    });
    
    return new Chart(ctx, {
       type: "line",
       data:
       {
            datasets: [
                {
                    label: chemParameter,
                    data: dataPoints, 
                    fill: false,
                    borderColor: "rgb(75, 150, 150)",
                    lineTension: 0.1
                }
            ],
       },
       options: {
            scales: {
            	xAxes: [{
            		scaleLabel: {
            			display: true,
            			labelString: "Date"
            		},
            		type: "time",
            		unit: "day",
            		unitStepSize: 1,
            		time: {
            			displayFormats: {
            				"day": "MMM DD YYYY"
            			}
            		},
            		position: 'bottom'
            	}],
                yAxes: [{
                	scaleLabel: {
            			display: true,
            			labelString: chemUnits
            			// labelString: "Ammonia ppm (mg/L)"
            		},
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}