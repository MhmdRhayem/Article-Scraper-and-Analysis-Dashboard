const totalArticlesDiv = document.getElementById("articlesCount");
totalArticlesDiv.style.fontSize = "24px";
totalArticlesDiv.style.fontWeight = "bold";
totalArticlesDiv.style.textAlign = "center";
totalArticlesDiv.style.color = "#333";
totalArticlesDiv.style.margin = "20px 0";
totalArticlesDiv.style.lineHeight = "1.5";
totalArticlesDiv.style.fontFamily = "'Arial', sans-serif";
async function fetchTotalArticles() {
  try {
    const response = await fetch("http://127.0.0.1:5000/articles_count");
    const data = await response.json();
    console.log(data);

    totalArticlesDiv.textContent = `${data}`;
  } catch (error) {
    console.error("Error fetching total articles:", error);

    totalArticlesDiv.textContent = "Error fetching total articles";
  }
}

fetchTotalArticles();
