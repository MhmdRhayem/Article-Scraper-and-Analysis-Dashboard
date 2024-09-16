const neutralArticlesDiv = document.getElementById("neutralArticlesCount");
neutralArticlesDiv.style.fontSize = "24px";
neutralArticlesDiv.style.fontWeight = "bold";
neutralArticlesDiv.style.textAlign = "center";
neutralArticlesDiv.style.color = "#333";
neutralArticlesDiv.style.margin = "20px 0";
neutralArticlesDiv.style.lineHeight = "1.5";
neutralArticlesDiv.style.fontFamily = "'Arial', sans-serif";
async function fetchTotalArticles() {
  try {
    const response = await fetch("http://127.0.0.1:5000/articles_by_sentiment_count");
    const data = await response.json();
    let articlesCount = 0;
    data.forEach(ele => {
        if (ele._id = "Neutral"){
            articlesCount = ele.count;
        }
    })

    neutralArticlesDiv.textContent = `${articlesCount}`;
  } catch (error) {
    console.error("Error fetching total articles:", error);

    neutralArticlesDiv.textContent = "Error fetching total articles";
  }
}

fetchTotalArticles();
