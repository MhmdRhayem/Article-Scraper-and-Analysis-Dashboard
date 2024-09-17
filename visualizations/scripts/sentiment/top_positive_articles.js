am5.ready(async function () {
    var chartDiv = document.getElementById("topPositiveArticles");
    chartDiv.style.width = "100%";
    chartDiv.style.height = "500px";
    var root = am5.Root.new("topPositiveArticles");
  
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
        categoryField: "title",
        renderer: am5xy.AxisRendererX.new(root, {}),
        // tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis.get("renderer").labels.template.set("visible", false);
  
    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );
  
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "polarity",
        categoryXField: "title",
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
  
    // xAxis.children.push(
    //   am5.Label.new(root, {
    //     text: "Keywords Count",
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
  
    async function topPositiveArticles() {
      const response = await fetch(
        "http://127.0.0.1:5000/articles_by_sentiment/Positive"
      );
      const data = await response.json();
      return data;
    }
  
    let data = await topPositiveArticles();
    xAxis.data.setAll(data);
    series.data.setAll(data);
  
    chart.set("cursor", am5xy.XYCursor.new(root, {}));
  
    series.appear(1000);
    chart.appear(1000, 100);
  });
  