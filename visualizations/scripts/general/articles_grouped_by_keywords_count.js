am5.ready(async function () {
  var chartDiv = document.getElementById("articlesGroupedByKeywordsCount");
  chartDiv.style.width = "100%";
  chartDiv.style.height = "500px";
  var root = am5.Root.new("articlesGroupedByKeywordsCount");

  root.setThemes([am5themes_Animated.new(root)]);

  async function getArticlesByKeywordCount() {
    let articlesByKeywordCount = { children: [] };
    const response = await fetch(
      "http://127.0.0.1:5000/articles_grouped_by_keywords_count"
    );
    const data = await response.json();
    data.forEach((element) => {
      articlesByKeywordCount.children.push({ name: element._id, children: [] });
      element.titles.forEach((title) => {
        articlesByKeywordCount.children[
          articlesByKeywordCount.children.length - 1
        ].children.push({ name: title });
      });
    });
    return articlesByKeywordCount;
  }

  let data = await getArticlesByKeywordCount();
  console.log(data);

  let container = root.container.children.push(
    am5.Container.new(root, {
      width: am5.percent(100),
      height: am5.percent(100),
      layout: root.verticalLayout,
    })
  );

  let series = container.children.push(
    am5hierarchy.ForceDirected.new(root, {
      singleBranchOnly: false,
      downDepth: 2,
      topDepth: 1,
      initialDepth: 0,
      categoryField: "name",
      childDataField: "children",
      idField: "name",
      linkWithField: "linkWith",
      manyBodyStrength: -10,
      centerStrength: 0.8,
    })
  );

  series.get("colors").setAll({
    step: 2,
  });

  series.links.template.set("strength", 0.5);

  series.data.setAll([data]);

  series.set("selectedDataItem", series.dataItems[0]);
  series.nodes.template.set("tooltipText", "{name}");

  series.appear(1000, 100);
});
