    const totalArticlesDiv = document.getElementById("totalArticles");
  
    async function fetchTotalArticles() {
      try {
        const response = await fetch("http://127.0.0.1:5000/articles_count");
        const data = await response.json();
        console.log(data)

        totalArticlesDiv.textContent = `${data}`;
        
      } catch (error) {
        console.error("Error fetching total articles:", error);

        totalArticlesDiv.textContent = "Error fetching total articles";
      }
    }

fetchTotalArticles();
  