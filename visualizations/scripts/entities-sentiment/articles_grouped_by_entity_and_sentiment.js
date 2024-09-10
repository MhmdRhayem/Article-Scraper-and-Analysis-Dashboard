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

    async function getArticles() {
        const response = await fetch('http://127.0.0.1:5000/articles_grouped_by_entity_and_sentiment')
        const data = await response.json()
        let aggregatedData = {};
        data.forEach(item => {
            const entity = item._id.entity;
            const sentiment = item._id.sentiment;
            const count = item.count;
    
            if (!aggregatedData[entity]) {
                aggregatedData[entity] = {
                    entity: entity,
                    Negative: 0,
                    Positive: 0,
                    Neutral: 0
                };
            }

            aggregatedData[entity][sentiment] += count;
        });
    
        return Object.values(aggregatedData);
    }
    let data = await getArticles();
    console.log(data)
    
    var xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true
    });
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "entity",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    xRenderer.grid.template.setAll({
      location: 1
    })
    
    xAxis.data.setAll(data);
    
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
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
        categoryXField: "entity"
      }));
    
      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}: {valueY}",
        tooltipY: am5.percent(10)
      });
      series.data.setAll(data);
    
      series.appear();
    
      legend.data.push(series);
    }
    const sentiments = ['Positive', 'Negative', 'Neutral']
    sentiments.forEach(sentiment => {
      makeSeries(sentiment, sentiment);
    })
    
    chart.appear(1000, 100);
    
    });