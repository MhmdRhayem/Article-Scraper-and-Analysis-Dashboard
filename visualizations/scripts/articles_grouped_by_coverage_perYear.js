am5.ready(async function() {

  var root = am5.Root.new("chartdiv");
  

  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  

  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    paddingLeft: 0,
    layout: root.verticalLayout
  }));

  chart.set("scrollbarX", am5.Scrollbar.new(root, {
    orientation: "horizontal"
  }));
  
  async function getArticlesByCategory(){
    let articles_grouped_by_category = [];
    const response = await fetch("http://127.0.0.1:5000/articles_grouped_by_coverage_perYear");
    const data = await response.json();
    
    data.forEach(element => {
      let articleCategory = {
        year: element._id
      };

      element.coverages.forEach((coverage, index) => {
        if (index < 5) {
          let category = coverage.category;
          let count = coverage.count;

          articleCategory[category] = count;
        }
      });

      articles_grouped_by_category.push(articleCategory);
    });

    return articles_grouped_by_category;
  }

  let data = await getArticlesByCategory();
  console.log(data);
  
  var xRenderer = am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true
  });
  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "year",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));
  
  xRenderer.grid.template.setAll({
    location: 1
  })
  
  xAxis.data.setAll(data);
  
  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    min: 1,
    renderer: am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1,
    })
  }));

  var legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  }));

  function makeSeries(name, fieldName) {
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: name,
      stacked: true,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: fieldName,
      categoryXField: "year"
    }));
  
    series.columns.template.setAll({
      tooltipText: "{name}: {valueY}",
      tooltipY: am5.percent(10)
    });
    series.data.setAll(data);
  
    series.appear();
  
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: "",
          fill: root.interfaceColors.get("alternativeText"),
          centerY: am5.p50,
          centerX: am5.p50,
          populateText: true
        })
      });
    });
  
    legend.data.push(series);
  }
  
  const createdSeries = new Set();
data.forEach(element => {
  Object.keys(element).forEach(key => {
    if (key !== "year" && !createdSeries.has(key)) { 
      makeSeries(key, key);
      createdSeries.add(key);
    }
  });
});
  
  chart.appear(1000, 100);
  
  });