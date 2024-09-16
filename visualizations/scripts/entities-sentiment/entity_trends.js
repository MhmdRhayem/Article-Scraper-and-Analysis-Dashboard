async function createChart() {
    async function getTopEntities(){
        const top_entities_response = await fetch("http://127.0.0.1:5000/top_entities");
        let top_entities = await top_entities_response.json();
        top_entities = top_entities.map((entity) => entity["_id"]);
        return top_entities;
    }
    let top_entities = await getTopEntities();
    async function entity_trends() {
      const response = await fetch("http://127.0.0.1:5000/entity_trends");
      const data = await response.json();
    
      let formatted_data = {};
      console.log(top_entities);
      top_entities.forEach((entity) => {
        formatted_data[entity] = [];
      });
    
      data.forEach((element) => {
        let year = element["year"];
        let month = element["month"];
        let count = element["count"];
        let entity = element["entity"];
    
        let date = new Date(year, month - 1, 1);
    
        formatted_data[entity].push({
          date: date.getTime(),
          value: count,
        });
      });
      console.log(formatted_data);
      return formatted_data;
    }
  const data = await entity_trends();

  am5.ready(async function () {
    var chartDiv = document.getElementById("entityTrends");
    chartDiv.style.width = "100%";
    chartDiv.style.height = "500px";
    var root = am5.Root.new("entityTrends");

    const myTheme = am5.Theme.new(root);
    myTheme.rule("AxisLabel", ["minor"]).setAll({ dy: 1 });
    myTheme.rule("Grid", ["x"]).setAll({ strokeOpacity: 0.05 });
    myTheme.rule("Grid", ["x", "minor"]).setAll({ strokeOpacity: 0.05 });

    root.setThemes([am5themes_Animated.new(root), myTheme]);

    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        maxTooltipDistance: 0,
        pinchZoomX: true,
      })
    );

    var xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: { timeUnit: "month", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, { minorGridEnabled: true }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    top_entities.forEach((entity) => {
      var series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: entity,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "date",
          legendValueText: "{valueY}",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}",
          }),
        })
      );
      series.data.setAll(data[entity]);

      // series.set("stroke", sentimentColors[entity]);
    });

    var cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      })
    );
    cursor.lineY.set("visible", false);

    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, { orientation: "horizontal" })
    );
    chart.set(
      "scrollbarY",
      am5.Scrollbar.new(root, { orientation: "vertical" })
    );

    var legend = chart.rightAxesContainer.children.push(
      am5.Legend.new(root, {
        width: 200,
        paddingLeft: 15,
        height: am5.percent(100),
      })
    );

    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100);
  });
}

createChart();
