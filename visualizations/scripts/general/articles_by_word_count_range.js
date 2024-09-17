am5.ready(async function () {
  var chartDiv = document.getElementById("articlesByWordCountRange");
  chartDiv.style.width = "100%";
  chartDiv.style.height = "500px";
  var root = am5.Root.new("articlesByWordCountRange");
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
      categoryField: "range",
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
      categoryXField: "range",
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

  let bins = 100,
  max_word_count = 1000;

  async function getLongestArticleWordCount() {
    let response = await fetch("http://127.0.0.1:5000/longest_articles");
    let data = await response.json();
    return data[0].word_count;
  }

  max_word_count = await getLongestArticleWordCount();
  console.log(max_word_count);

  async function getArticlesByWordCountRange() {
    let range = 0;
    let articles_by_range = [];
    while (range < max_word_count) {
      let response = await fetch(
        `http://127.0.0.1:5000/articles_by_word_count_range/${range}/${
          range + bins
        }`
      );
      let data = await response.json();
      console.log(data.length);
      articles_by_range.push({
        range: `${range}-${range + bins}`,
        count: data.length,
      });
      range += bins;
    }
    return articles_by_range;
  }

  let data = await getArticlesByWordCountRange();
  console.log(data);

  xAxis.children.push(
    am5.Label.new(root, {
      text: "Range",
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
      text: "Articles Count",
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

  xAxis.data.setAll(data);
  series.data.setAll(data);

  series.appear(1000);
  chart.appear(1000, 100);
});
