am5.ready(async function () {
  var chartDiv = document.getElementById("entitiesByYear");
  chartDiv.style.width = "100%";
  chartDiv.style.height = "500px";
  var root = am5.Root.new("entitiesByYear");

  root.setThemes([am5themes_Animated.new(root)]);

  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 0,
      layout: root.verticalLayout,
    })
  );

  chart.set(
    "scrollbarX",
    am5.Scrollbar.new(root, {
      orientation: "horizontal",
    })
  );

  async function entities_by_year() {
    const response = await fetch("http://127.0.0.1:5000/entities_by_year");
    const data = await response.json();
    let formatted_data = [];
    data.forEach((element) => {
      let obj = {};
      obj["year"] = element["_id"];
      element["entities"].forEach((entity) => {
        obj[entity["entity"]] = entity["count"];
      });
      formatted_data.push(obj);
    });
    formatted_data.sort((a, b) => a["year"] - b["year"]);
    return formatted_data;
  }
  let data = await entities_by_year();
  console.log(data);

  var xRenderer = am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true,
  });
  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "year",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  xRenderer.grid.template.setAll({
    location: 1,
  });

  xAxis.data.setAll(data);

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      max: 100,
      numberFormat: "#'%'",
      strictMinMax: true,
      calculateTotals: true,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1,
      }),
    })
  );

  var legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
    })
  );

  function makeSeries(name, fieldName) {
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: name,
        stacked: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        valueYShow: "valueYTotalPercent",
        categoryXField: "year",
      })
    );

    series.columns.template.setAll({
      tooltipText: "{name} : {valueY}",
      tooltipY: am5.percent(10),
    });
    series.data.setAll(data);

    series.appear();

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: "{valueYTotalPercent.formatNumber('#.#')}%",
          fill: root.interfaceColors.get("alternativeText"),
          centerY: am5.p50,
          centerX: am5.p50,
          populateText: true,
        }),
      });
    });

    legend.data.push(series);
  }

  const set = new Set();
  data.forEach((element) => {
    let keys = Object.keys(element);
    keys.forEach((key) => {
      if (!set.has(key) && key !== "year") {
        set.add(key);
        makeSeries(key, key);
      }
    });
  });

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  chart.appear(1000, 100);
}); // end am5.ready()
