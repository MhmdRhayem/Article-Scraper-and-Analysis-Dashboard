const TrendingKeyword = document.getElementById("trendingKeyword");
TrendingKeyword.style.fontSize = "24px";
TrendingKeyword.style.fontWeight = "bold";
TrendingKeyword.style.textAlign = "center";
TrendingKeyword.style.color = "#333";
TrendingKeyword.style.margin = "20px 0";
TrendingKeyword.style.lineHeight = "1.5";
TrendingKeyword.style.fontFamily = "'Arial', sans-serif";
    async function fetchTrendingKeyword() {
      try {
        const response = await fetch("http://127.0.0.1:5000/top_keywords");
        let data = await response.json();
        data = data[0]["_id"];

        TrendingKeyword.textContent = `${data}`;
        
      } catch (error) {
        console.error("Error fetching trending keyword:", error);

        TrendingKeyword.textContent = "Error fetching trending keyword";
      }
    }

fetchTrendingKeyword();