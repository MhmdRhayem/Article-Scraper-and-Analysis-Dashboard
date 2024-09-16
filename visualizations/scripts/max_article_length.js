const maxArticleLength = document.getElementById("maxArticleLength");
  
    async function fetchMaxArticleLength() {
      try {
        const response = await fetch("http://127.0.0.1:5000/longest_articles");
        let data = await response.json();
        data = data[0]["word_count"];

        maxArticleLength.textContent = `${data}`;
        
      } catch (error) {
        console.error("Error fetching max article length:", error);

        maxArticleLength.textContent = "Error fetching max article length";
      }
    }

fetchMaxArticleLength();