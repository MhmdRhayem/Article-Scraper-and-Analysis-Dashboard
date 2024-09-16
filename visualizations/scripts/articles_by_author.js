const inputContainer = document.createElement("div");
inputContainer.className = "input-container";

const articlesByAuthorInput = document.createElement("input");
articlesByAuthorInput.type = "text";
articlesByAuthorInput.id = "articlesByAuthorInput";
articlesByAuthorInput.placeholder = "Enter Author Name";
articlesByAuthorInput.classList.add("InputField");
inputContainer.appendChild(articlesByAuthorInput);

const fetchArticlesByAuthorButton = document.createElement("button");
fetchArticlesByAuthorButton.id = "fetchArticlesByAuthorButton";
fetchArticlesByAuthorButton.textContent = "Fetch Data";
fetchArticlesByAuthorButton.classList.add("fetchButton");
inputContainer.appendChild(fetchArticlesByAuthorButton);

document.getElementById("articlesByAuthor").appendChild(inputContainer);

am5.ready(async function () {
  var root = am5.Root.new("articlesByAuthor");

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
  });

  yRenderer.grid.template.set("location", 1);

  var yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "author",
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

  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "count",
      categoryYField: "author",
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
  async function getArticlesByAuthor(author_name) {
    const response = await fetch(
      `http://127.0.0.1:5000/articles_by_author/${author_name}`
    );
    const data = await response.json();
    let articles_by_author = [
      {
        author: author_name,
        count: data.length,
      },
    ];
    return articles_by_author;
  }

  let data = await getArticlesByAuthor("الميادين نت");
  console.log(data);

  document
    .getElementById("fetchArticlesByAuthorButton")
    .addEventListener("click", async function () {
      const author_name = document.getElementById(
        "articlesByAuthorInput"
      ).value;
      data = await getArticlesByAuthor(author_name);
      yAxis.data.setAll(data);
      series.data.setAll(data);
    });

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

  xAxis.children.push(
    am5.Label.new(root, {
      text: "Articles Count",
      fontSize: "1em",
      fontWeight: "600",
      fill: am5.color(0x555555),
      x: am5.p50,
      centerX: am5.p50,
      centerY: am5.p100,
      dy: 20,
    })
  );

  series.appear(1000);
  chart.appear(1000, 100);
});
