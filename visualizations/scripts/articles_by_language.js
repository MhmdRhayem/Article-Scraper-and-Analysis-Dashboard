am5.ready(async function () {
  var root = am5.Root.new("chartdiv");

  root.setThemes([am5themes_Animated.new(root)]);

  var chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      endAngle: 270,
    })
  );

  var series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "count",
      categoryField: "_id",
      endAngle: 270,
    })
  );

  series.states.create("hidden", {
    endAngle: -90,
  });

  async function getArticlesByLanguage() {
    const response = await fetch("http://127.0.0.1:5000/articles_by_language");
    const data = await response.json();
    return data;
  }
  const data = await getArticlesByLanguage();
  series.data.setAll(data);
  series.appear(1000, 100);
});
