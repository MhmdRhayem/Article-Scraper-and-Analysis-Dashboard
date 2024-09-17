const negativeArticlesCountsDiv = document.getElementById("negativeArticlesCount");
negativeArticlesCountsDiv.style.fontSize = "24px";
negativeArticlesCountsDiv.style.fontWeight = "bold";
negativeArticlesCountsDiv.style.textAlign = "center";
negativeArticlesCountsDiv.style.color = "#333";
negativeArticlesCountsDiv.style.margin = "20px 0";
negativeArticlesCountsDiv.style.lineHeight = "1.5";
negativeArticlesCountsDiv.style.fontFamily = "'Arial', sans-serif";
async function fetchTotalArticles() {
  try {
    const response = await fetch("http://127.0.0.1:5000/articles_by_sentiment_count");
    const data = await response.json();
    let articlesCount = 0;
    data.forEach(ele => {
        if (ele._id == "Negative"){
            articlesCount = ele.count;
        }
    })

    negativeArticlesCountsDiv.textContent = `${articlesCount}`;
  } catch (error) {
    console.error("Error fetching total articles:", error);

    negativeArticlesCountsDiv.textContent = "Error fetching total articles";
  }
}

fetchTotalArticles();
