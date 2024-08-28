const inputContainer = document.createElement("div");
inputContainer.className = "input-container";

const postIdInput = document.createElement("input");
postIdInput.type = "text";
postIdInput.id = "postIdInput";
postIdInput.placeholder = "Enter Day";
inputContainer.appendChild(postIdInput);

const fetchButton = document.createElement("button");
fetchButton.id = "fetchButton";
fetchButton.textContent = "Fetch Data";
inputContainer.appendChild(fetchButton);

document.body.insertBefore(inputContainer, document.getElementById("chartdiv"));

am5.ready(async function () {
  var root = am5.Root.new("chartdiv");

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

  xAxis.children.push(
    am5.Label.new(root, {
      text: "Keywords",
      x: am5.p50,
      centerX: am5.p50,
      centerY: am5.p100,
    })
  );

  yAxis.children.push(
    am5.Label.new(root, {
      text: "Count",
      rotation: -90,
      y: am5.p50,
      centerX: am5.p50,
      centerY: am5.p50,
    })
  );

  async function getPopularKeywordsLastXDays(day) {
    const response = await fetch(
      "http://127.0.0.1:5000/popular_keywords_last_X_days/" + day.toString()
    );
    const data = await response.json();
    return data;
  }
  
  let data = await getPopularKeywordsLastXDays(15);

  xAxis.data.setAll(data);
  series.data.setAll(data);

  series.appear(1000);
  chart.appear(1000, 100);
});

document.getElementById("fetchButton").addEventListener("click", async function () {
  const day = document.getElementById("postIdInput").value;
  let data = await getPopularKeywordsLastXDays(day);
  xAxis.data.setAll(data);
  series.data.setAll(data);
});
