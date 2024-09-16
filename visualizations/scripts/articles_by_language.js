am5.ready(async function () {
  var chartDiv = document.getElementById("articlesByLanguage");
  chartDiv.style.width = "100%";
  chartDiv.style.height = "300px";
  var root = am5.Root.new("articlesByLanguage");

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

  // Remove the labels
  series.labels.template.set("forceHidden", true); // Hide labels

  // Optionally, you can also hide the ticks if you want to completely remove labels
  series.ticks.template.set("forceHidden", true); // Hide ticks if needed

  async function getArticlesByLanguage() {
    const response = await fetch("http://127.0.0.1:5000/articles_by_language");
    const data = await response.json();
    return data;
  }
  const data = await getArticlesByLanguage();
  series.data.setAll(data);
  series.appear(1000, 100);
});
