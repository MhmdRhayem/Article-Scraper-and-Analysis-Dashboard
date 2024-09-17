am5.ready(async function () {
  var chartDiv = document.getElementById("topEntityBySentiment");
  chartDiv.style.width = "100%";
  chartDiv.style.height = "400px";
  var root = am5.Root.new("topEntityBySentiment");
    
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
      layout: root.verticalLayout
    }));
    
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    var series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: "count",
      categoryField: "_id"
    }));
    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);
    
    series.slices.template.set("tooltipText", "{category}: {value}");

    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    let top_entity = ""
    async function getTopEntityBySentiment() {
        top_entity = (await (await fetch("http://127.0.0.1:5000/top_entities")).json())[0]["_id"];
        const respone = await fetch(
          "http://127.0.0.1:5000/top_entity_by_sentiment"
        );
        const data = await respone.json();
        console.log(data);
        return data;
      }
      let data = await getTopEntityBySentiment();
      
      series.data.setAll(data);

      var title = chart.children.unshift(am5.Label.new(root, {
        text: top_entity,
        fontSize: 25,
        fontWeight: "500",
        textAlign: "center",
        x: am5.percent(50),  // Centering title
        centerX: am5.percent(50)  // Centering title
      }));

      var legend = chart.children.push(am5.Legend.new(root, {
        y: am5.percent(0),
        centerY: am5.percent(0),
        x: am5.percent(65),
        layout: root.verticalLayout
      }));
      
      legend.data.setAll(series.dataItems);

      

    // Play initial series animation
    // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
    series.appear(1000, 100);
    
    });