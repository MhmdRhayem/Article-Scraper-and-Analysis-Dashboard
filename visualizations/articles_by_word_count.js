am5.ready(async function () {
  var root = am5.Root.new("chartdiv");

  root.setThemes([am5themes_Animated.new(root)]);

  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0,
      paddingRight: 1,
    })
  );

  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "_id",
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      categoryXField: "_id",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{categoryX}: [bold]{valueY}[/]",
      }),
    })
  );

  series.columns.template.setAll({
    cornerRadiusTL: 5,
    cornerRadiusTR: 5,
    strokeOpacity: 0,
  });

  series.columns.template.adapters.add("fill", function (fill, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  series.columns.template.adapters.add("stroke", function (stroke, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  async function getTopAuthors() {
    const response = await fetch(
      "http://127.0.0.1:5000/articles_by_word_count"
    );
    const data = await response.json();
    return data;
  }
  let data = await getTopAuthors();

  xAxis.data.setAll(data);
  series.data.setAll(data);

  chart.set("cursor", am5xy.XYCursor.new(root, {}));

  series.appear(1000);
  chart.appear(1000, 100);
});
