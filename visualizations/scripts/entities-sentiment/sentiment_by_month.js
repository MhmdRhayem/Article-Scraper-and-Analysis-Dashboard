const sentiments = ["Positive", "Negative", "Neutral"];

async function sentiment_by_month() {
    const response = await fetch("http://127.0.0.1:5000/sentiments_by_month");
    const data = await response.json();
    let formatted_data = {
        Positive: [],
        Negative: [],
        Neutral: []
    };

    data.forEach(element => {
        let year = element["year"];
        let month = element["month"];
        let count = element["count"];
        let sentiment = element["sentiment"];
        
        let date = new Date(year, month - 1, 1);
        
        formatted_data[sentiment].push({
            date: date.getTime(),
            value: count
        });
    });

    return formatted_data;
}

async function createChart() {
    const data = await sentiment_by_month();

    am5.ready(function() {
        var root = am5.Root.new("chartdiv");
        
        const myTheme = am5.Theme.new(root);
        myTheme.rule("AxisLabel", ["minor"]).setAll({ dy: 1 });
        myTheme.rule("Grid", ["x"]).setAll({ strokeOpacity: 0.05 });
        myTheme.rule("Grid", ["x", "minor"]).setAll({ strokeOpacity: 0.05 });
        
        root.setThemes([
            am5themes_Animated.new(root),
            myTheme
        ]);
        
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            maxTooltipDistance: 0,
            pinchZoomX: true
        }));
        
        var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
            maxDeviation: 0.2,
            baseInterval: { timeUnit: "month", count: 1 },
            renderer: am5xy.AxisRendererX.new(root, { minorGridEnabled: true }),
            tooltip: am5.Tooltip.new(root, {})
        }));
        
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        sentiments.forEach(sentiment => {
            var series = chart.series.push(am5xy.LineSeries.new(root, {
                name: sentiment,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                valueXField: "date",
                legendValueText: "{valueY}",
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "{valueY}"
                })
            }));

            series.data.setAll(data[sentiment]); 
        });
        
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "none"
        }));
        cursor.lineY.set("visible", false);
        
        chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
        chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical" }));

        var legend = chart.rightAxesContainer.children.push(am5.Legend.new(root, {
            width: 200,
            paddingLeft: 15,
            height: am5.percent(100)
        }));
        
        legend.data.setAll(chart.series.values);
        
        chart.appear(1000, 100);
    }); 
}

createChart();
