am5.ready(async function () {
  var chartDiv = document.getElementById("articlesWithThumbnail");
  chartDiv.style.width = "100%";
  chartDiv.style.height = "500px";
  var root = am5.Root.new("articlesWithThumbnail");

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

  async function getArticlesWithThumbnail() {
    const response = await fetch(
      "http://127.0.0.1:5000/articles_with_thumbnail"
    );
    const data = await response.json();
    return data;
  }

  async function getAllArticlesCount() {
    const response = await fetch("http://127.0.0.1:5000/articles_count");
    return await response.json();
  }

  let articles_with_thumbnail_count = (await getArticlesWithThumbnail()).length;
  let articles_without_thumbnail_count =
    (await getAllArticlesCount()) - articles_with_thumbnail_count;

  data = [
    {
      _id: "Articles Without Thumbnail",
      count: articles_without_thumbnail_count,
    },
    { _id: "Articles With Thumbnail", count: articles_with_thumbnail_count },
  ];

  console.log(data)
  
  series.data.setAll(data);
  series.appear(1000, 100);
});
