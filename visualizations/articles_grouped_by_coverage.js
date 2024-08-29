am5.ready(async function () {
  var root = am5.Root.new("chartdiv");

  var myTheme = am5.Theme.new(root);

  myTheme.rule("Grid", ["base"]).setAll({
    strokeOpacity: 0.1,
  });

  root.setThemes([am5themes_Animated.new(root), myTheme]);

  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomY",
      pinchZoomX: true,
      paddingLeft: 0,
      layout: root.verticalLayout,
    })
  );

  chart.set(
    "scrollbarX",
    am5.Scrollbar.new(root, {
      orientation: "horizontal",
    })
  );

  chart.set(
    "scrollbarY",
    am5.Scrollbar.new(root, {
      orientation: "vertical",
    })
  );

  async function fetchData() {
    const response = await fetch(
      "http://127.0.0.1:5000/articles_grouped_by_coverage"
    );
    const data = await response.json();
    let coverage_arr = [{ categories: "coverage" }];
    data.forEach((element) => {
      coverage_arr[0][element._id] = element.count;
    });
    return coverage_arr;
  }
  let data = await fetchData();

  var yRenderer = am5xy.AxisRendererY.new(root, {});
  var yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "categories",
      renderer: yRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  yRenderer.grid.template.setAll({
    location: 1,
  });

  yAxis.data.setAll(data);

  var xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      maxPrecision: 0,
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 40,
        strokeOpacity: 0.1,
      }),
    })
  );

  var legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
    })
  );

  function makeSeries(name, fieldName) {
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: name,
        stacked: true,
        xAxis: xAxis,
        yAxis: yAxis,
        baseAxis: yAxis,
        valueXField: fieldName,
        categoryYField: "categories",
      })
    );

    series.columns.template.setAll({
      tooltipText: "{name}, {categoryY}: {valueX}",
      tooltipY: am5.percent(90),
    });
    series.data.setAll(data);

    series.appear();

    legend.data.push(series);
  }

  xAxis.children.push(
    am5.Label.new(root, {
      text: "Articles Count",
      fontSize: "1em",
      fontWeight: "600",
      fill: am5.color(0x555555),
      x: am5.p50,
      centerX: am5.p50,
      centerY: am5.p100,
      dy: 20,
    })
  );

  yAxis.children.unshift(
    am5.Label.new(root, {
      text: "Categories",
      fontSize: "1em",
      fontWeight: "600",
      fill: am5.color(0x555555),
      rotation: -90,
      y: am5.p50,
      centerY: am5.p50,
      centerX: am5.p100,
      dx: -30,
    })
  );

  Object.keys(data[0]).forEach((key) => {
    makeSeries(key, key);
  });

  chart.appear(1000, 100);
});
