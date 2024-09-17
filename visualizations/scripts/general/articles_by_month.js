am5.ready(async function () {
  var chartDiv = document.getElementById("articlesByMonth");
  chartDiv.style.width = "100%";
  chartDiv.style.height = "500px";
  var root = am5.Root.new("articlesByMonth");

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

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);

  var xRenderer = am5xy.AxisRendererX.new(root, {
    minGridDistance: 30,
    minorGridEnabled: true,
  });

  xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15,
  });

  xRenderer.grid.template.setAll({
    location: 1,
  });

  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "date",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  var yRenderer = am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1,
  });

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: yRenderer,
    })
  );

  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      sequencedInterpolation: true,
      categoryXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}",
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

  async function getArticlesGroupedByMonth() {
    const response = await fetch("http://127.0.0.1:5000/articles_grouped_by_month")
    const data = await response.json()
    let articles_by_month = []
    data.forEach(element=>{
      articles_by_month.push({
        date: element._id.year + "-" + element._id.month,
        count: element.count
      })
    })
    return articles_by_month;
  }
  let data = await getArticlesGroupedByMonth();
  // data.reverse()
  console.log(data)

  // xAxis.children.push(
  //   am5.Label.new(root, {
  //     text: "Date",
  //     fontSize: "1em",
  //     fontWeight: "600",
  //     fill: am5.color(0x555555),
  //     x: am5.p50,
  //     centerX: am5.p50,
  //     centerY: am5.p100,
  //     dy: 20,
  //   })
  // );

  // yAxis.children.unshift(
  //   am5.Label.new(root, {
  //     text: "Articles Count",
  //     fontSize: "1em",
  //     fontWeight: "600",
  //     fill: am5.color(0x555555),
  //     rotation: -90,
  //     y: am5.p50,
  //     centerY: am5.p50,
  //     centerX: am5.p100,
  //     dx: -30,
  //   })
  // );


  xAxis.data.setAll(data);
  series.data.setAll(data);

  series.appear(1000);
  chart.appear(1000, 100);
});
