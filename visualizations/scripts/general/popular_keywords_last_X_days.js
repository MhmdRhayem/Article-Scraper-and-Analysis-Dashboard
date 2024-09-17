const inputContainer = document.createElement("div");
inputContainer.className = "input-container";

const dateInput = document.createElement("input");
dateInput.type = "text";
dateInput.id = "dateInput";
dateInput.classList.add("InputField");
dateInput.placeholder = "Enter Day";
inputContainer.appendChild(dateInput);

const buttonFetchPopularKeywords = document.createElement("button");
buttonFetchPopularKeywords.id = "buttonFetchPopularKeywords";
buttonFetchPopularKeywords.textContent = "Fetch Data";
buttonFetchPopularKeywords.classList.add("fetchButton");
inputContainer.appendChild(buttonFetchPopularKeywords);

const chartContainer = document.querySelector(".chartContainer");
chartContainer.appendChild(inputContainer);

am5.ready(async function () {
  var root = am5.Root.new("popularKeywordsLastXDays");
  var chartDiv = document.getElementById("popularKeywordsLastXDays");
  chartDiv.style.width = "100%";
  chartDiv.style.height = "400px";
  root.setThemes([am5themes_Animated.new(root)]);

  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);

  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "_id",
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
    })
  );

  xAxis.get("renderer").labels.template.setAll({
    rotation: -45,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15,
  });

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  var series = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: "Count",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      categoryXField: "_id",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{categoryX}: {valueY}",
      }),
    })
  );

  series.strokes.template.setAll({
    strokeWidth: 2,
  });

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: series.get("fill"),
      }),
    });
  });

  async function getPopularKeywordsLastXDays(day) {
    const response = await fetch(
      "http://127.0.0.1:5000/popular_keywords_last_X_days/" + day.toString()
    );
    const data = await response.json();
    return data;
  }

  let data = await getPopularKeywordsLastXDays(30);

  document
    .getElementById("buttonFetchPopularKeywords")
    .addEventListener("click", async function () {
      const day = document.getElementById("dateInput").value;
      let data = await getPopularKeywordsLastXDays(day);
      xAxis.data.setAll(data);
      series.data.setAll(data);
    });

  xAxis.children.push(
    am5.Label.new(root, {
      text: "Keywords",
      fontSize: "1em",
      fontWeight: "600",
      fill: am5.color(0x555555),
      x: am5.p50,
      centerX: am5.p50,
      centerY: am5.p100,
      dy: 20,
    })
  );

  yAxis.children.unshift(
    am5.Label.new(root, {
      text: "Articles Count",
      fontSize: "1em",
      fontWeight: "600",
      fill: am5.color(0x555555),
      rotation: -90,
      y: am5.p50,
      centerY: am5.p50,
      centerX: am5.p100,
      dx: -30,
    })
  );

  xAxis.data.setAll(data);
  series.data.setAll(data);

  series.appear(1000);
  chart.appear(1000, 100);
});
