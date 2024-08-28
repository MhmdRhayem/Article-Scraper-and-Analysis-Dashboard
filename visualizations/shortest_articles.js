am5.ready(async function () {
    var root = am5.Root.new("chartdiv");
  
    root.setThemes([am5themes_Animated.new(root)]);
  
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
      })
    );
  
    chart.zoomOutButton.set("forceHidden", true);
  
    var yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true,
      inversed: true,
    });
  
    yRenderer.grid.template.set("location", 1);
  
    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "title",
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, { themeTags: ["axis"] }),
      })
    );
  
    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        numberFormatter: am5.NumberFormatter.new(root, {
          numberFormat: "#,###a",
        }),
        extraMax: 0.1,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
          minGridDistance: 80,
        }),
      })
    );
  
    xAxis.children.push(
      am5.Label.new(root, {
        text: "Word Count",
        x: am5.p100,
        centerX: am5.p100,
        centerY: am5.p0,
        paddingTop: 5,
      })
    );
  
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "word_count",
        categoryYField: "title",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "left",
          labelText: "{valueX}",
        }),
      })
    );
  
    series.columns.template.setAll({
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
      strokeOpacity: 0,
    });
  
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
  
    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
  
    async function getshortestArticles() {
      const response = await fetch("http://127.0.0.1:5000/shortest_articles");
      let data = await response.json();
  
      let titleSet = new Set();
      data = data.map((item) => {
        let originalTitle = item.title;
        let title = originalTitle;
        let index = 1;
  
        while (titleSet.has(title)) {
          title = `${originalTitle} ${index}`;
          index++;
        }
  
        titleSet.add(title);
        return { ...item, title: title };
      });
  
      return data;
    }
  
    let data = await getshortestArticles();
    data.reverse();
  
    yAxis.data.setAll(data);
    series.data.setAll(data);
  
    chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
        xAxis: xAxis,
        yAxis: yAxis,
      })
    );
  
    series.appear(1000);
    chart.appear(1000, 100);
  });
  