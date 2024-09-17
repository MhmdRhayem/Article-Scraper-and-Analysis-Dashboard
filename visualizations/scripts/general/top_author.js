const TopAuthor = document.getElementById("topAuthor");
TopAuthor.style.fontSize = "24px";
TopAuthor.style.fontWeight = "bold";
TopAuthor.style.textAlign = "center";
TopAuthor.style.color = "#333";
TopAuthor.style.margin = "20px 0";
TopAuthor.style.lineHeight = "1.5";
TopAuthor.style.fontFamily = "'Arial', sans-serif";
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