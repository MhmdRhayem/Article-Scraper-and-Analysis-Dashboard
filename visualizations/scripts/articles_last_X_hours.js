const inputContainer = document.createElement("div");
inputContainer.className = "input-container";

const hourInput = document.createElement("input");
hourInput.type = "text";
hourInput.id = "hourInput";
hourInput.classList.add("InputField");
hourInput.placeholder = "Enter Hours";
inputContainer.appendChild(hourInput);

const btnArticlesLastHours = document.createElement("button");
btnArticlesLastHours.id = "btnArticlesLastHours";
btnArticlesLastHours.textContent = "Fetch Data";
btnArticlesLastHours.classList.add("fetchButton");
inputContainer.appendChild(btnArticlesLastHours);

const chartContainer = document.querySelector(".chartContainer");
chartContainer.appendChild(inputContainer);

am5.ready(async function () {
    var root = am5.Root.new("articlesLastXHours");
    var chartDiv = document.getElementById("articlesLastXHours");
    chartDiv.style.width = "100%";
    chartDiv.style.height = "400px";

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
      inversed: true,
    });
  
    yRenderer.grid.template.set("location", 1);
  
    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "text",
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
        categoryYField: "text",
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
    
  
    async function getArticlesCount(hour) {
      const response = await fetch(`http://127.0.0.1:5000/articles_last_X_hours/${hour}`);
      const data = await response.json();
      let articles_by_hour = [{text:`Last ${hour} hours`,count : data.length}];
      return articles_by_hour;
    }
    let data = await getArticlesCount(24);

    document.getElementById("btnArticlesLastHours").addEventListener("click", async function () {
        const hour = document.getElementById("hourInput").value;
        data = await getArticlesCount(hour);
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
    
      yAxis.children.unshift(
        am5.Label.new(root, {
          text: "Type",
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
  
    series.appear(1000);
    chart.appear(1000, 100);
  });
  