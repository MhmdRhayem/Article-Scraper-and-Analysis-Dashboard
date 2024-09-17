const positiveArticlesDiv = document.getElementById("positiveArticlesCount");
positiveArticlesDiv.style.fontSize = "24px";
positiveArticlesDiv.style.fontWeight = "bold";
positiveArticlesDiv.style.textAlign = "center";
positiveArticlesDiv.style.color = "#333";
positiveArticlesDiv.style.margin = "20px 0";
positiveArticlesDiv.style.lineHeight = "1.5";
positiveArticlesDiv.style.fontFamily = "'Arial', sans-serif";
async function fetchTotalArticles() {
  try {
    const response = await fetch("http://127.0.0.1:5000/articles_by_sentiment_count");
    const data = await response.json();
    let articlesCount = 0;
    data.forEach(ele => {
        if (ele._id == "Positive"){
            articlesCount = ele.count;
        }
    })

    positiveArticlesDiv.textContent = `${articlesCount}`;
  } catch (error) {
    console.error("Error fetching total articles:", error);

    positiveArticlesDiv.textContent = "Error fetching total articles";
  }
}

fetchTotalArticles();
