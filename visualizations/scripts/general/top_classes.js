am5.ready(async function () {
  var chartDiv = document.getElementById("topClasses");
  chartDiv.style.width = "100%";
  chartDiv.style.height = "500px";
  var root = am5.Root.new("topClasses");

  root.setThemes([am5themes_Animated.new(root)]);

  var chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
    })
  );

  var series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "count",
      categoryField: "_id",
    })
  );

  async function getTopClasses() {
    const response = await fetch("http://127.0.0.1:5000/top_classes");
    const data = await response.json();
    console.log(data);
    return data;
  }

  series.data.setAll(await getTopClasses());

  var legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      marginTop: 15,
      marginBottom: 15,
    })
  );

  legend.data.setAll(series.dataItems);

  series.appear(1000, 100);
});
