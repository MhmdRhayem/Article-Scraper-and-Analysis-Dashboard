const TopAuthor = document.getElementById("topAuthor");
  
    async function fetchTopAuthor() {
      try {
        const response = await fetch("http://127.0.0.1:5000/top_authors");
        let data = await response.json();
        data = data[0]["_id"];

        TopAuthor.textContent = `${data}`;
        
      } catch (error) {
        console.error("Error fetching top author:", error);

        TopAuthor.textContent = "Error fetching top author";
      }
    }

fetchTopAuthor();