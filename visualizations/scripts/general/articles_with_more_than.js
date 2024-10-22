const inputContainer = document.createElement("div");
inputContainer.className = "input-container";

const countInput = document.createElement("input");
countInput.type = "text";
countInput.id = "countInput";
countInput.classList.add("InputField");
countInput.placeholder = "Enter Word Count";
inputContainer.appendChild(countInput);

const buttonArticlesByNumber = document.createElement("button");
buttonArticlesByNumber.id = "buttonArticlesByNumber";
buttonArticlesByNumber.textContent = "Fetch Data";
buttonArticlesByNumber.classList.add("fetchButton");
inputContainer.appendChild(buttonArticlesByNumber);

const chartContainer = document.querySelector(".chartContainer");
chartContainer.appendChild(inputContainer);

am5.ready(async function () {
    var root = am5.Root.new("articlesWithMoreThan");
    var chartDiv = document.getElementById("articlesWithMoreThan");
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
  
    async function getArticlesNumber(number){
        const response = await fetch(`http://127.0.0.1:5000/articles_with_more_than/${number}`)
        const data = await response.json();
        return [{text: `More than ${number} Words`, count: data.length}];
    }

    let data = await getArticlesNumber(0);
  
    document.getElementById("buttonArticlesByNumber").addEventListener("click", async function () {
        const number = document.getElementById("countInput").value;
        let data = await getArticlesNumber(number);
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
  
    series.appear(1000);
    chart.appear(1000, 100);
  });
  