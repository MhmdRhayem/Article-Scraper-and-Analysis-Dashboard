am5.ready(async function () {
  async function getTopKeyworeds() {
    const response = await fetch("http://127.0.0.1:5000/top_keywords");
    const data = await response.json();
    let text = [];
    data.forEach((item) => {
      text.push({
        keyword: item._id,
        count: item.count,
      });
    });
    return text;
  }
  let text = await getTopKeyworeds();

  console.log(text);

  let root = am5.Root.new("chartdiv");

  root.setThemes([am5themes_Animated.new(root)]);

  let zoomableContainer = root.container.children.push(
    am5.ZoomableContainer.new(root, {
      width: am5.p100,
      height: am5.p100,
      wheelable: true,
      pinchZoom: true,
    })
  );

  let zoomTools = zoomableContainer.children.push(
    am5.ZoomTools.new(root, {
      target: zoomableContainer,
    })
  );

  let series = zoomableContainer.contents.children.push(
    am5wc.WordCloud.new(root, {
      maxCount: 100,
      minWordLength: 2,
      maxFontSize: am5.percent(35),
      categoryField: "keyword",
      valueField: "count",
    })
  );

  series.data.setAll(text);

  series.labels.template.setAll({
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    fontFamily: "Courier New",
    tooltipText: "{keyword}: {count}",
  });
});
