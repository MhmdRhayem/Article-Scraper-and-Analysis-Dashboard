am5.ready(async function() {

    // Create root element
    var root = am5.Root.new("chartdiv");
    
    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    // Create chart
    var chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      startAngle: -84,
      endAngle: 264,
      innerRadius: am5.percent(40),
    }));
    
    // Add cursor
    const cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
      behavior: "zoomX"
    }));
    cursor.lineY.set("forceHidden", true);
    
    // Create axes
    var xRenderer = am5radar.AxisRendererCircular.new(root, {
      minGridDistance: 30
    });
    
    xRenderer.grid.template.set("forceHidden", true);
    
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "_id",
      renderer: xRenderer,
    }));
    
    var yRenderer = am5radar.AxisRendererRadial.new(root, {});
    yRenderer.labels.template.set("centerX", am5.p50);
    
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      min: 0,
      renderer: yRenderer
    }));
    
    yAxis.children.push(am5.Label.new(root, {
      rotation: -90,
      text: "Articles Count",
      y: am5.percent(50),
      centerX: am5.p50
    }));
    
    // Add series
    var series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
      name: "Series 1",
      sequencedInterpolation: true,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      categoryXField: "_id",
      tooltip: am5.Tooltip.new(root, {
        labelText: "Keywords Count: {categoryX}\nArticles Count: {valueY}"
      })
    }));
    
    // Rounded corners for columns
    series.columns.template.setAll({
      cornerRadius: 5,
      tooltipText: "{categoryX}: {valueY}"
    });
    
    // Make each column to be of a different color
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    
    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
  
    async function getArticlesByTopKeywordCount() {
      const response = await fetch("http://127.0.0.1:5000/articles_by_top_keyword_count");
      const data = await response.json();
      return data;
    }
    let data = await getArticlesByTopKeywordCount();
    
    xAxis.data.setAll(data);
    series.data.setAll(data);
    
    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);
    
    // Add labels for clarity
    chart.children.unshift(am5.Label.new(root, {
      text: "Keywords Count vs Articles Count",
      fontSize: 20,
      fontWeight: "bold",
      x: am5.p50,
      centerX: am5.p50,
      y: am5.percent(5),
      y: 0
    }));
    
    });

