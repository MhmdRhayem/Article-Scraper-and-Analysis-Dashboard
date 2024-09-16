const container = document.createElement("div");
container.className = "container";

const header = document.createElement("h2");
header.textContent = "Article Details";
container.appendChild(header);

const table = document.createElement("table");

const thead = document.createElement("thead");
const headerRow = document.createElement("tr");

const headers = ["Article Title", "Keywords", "Publication Date", "URL"];
headers.forEach((text) => {
  const th = document.createElement("th");
  th.textContent = text;
  headerRow.appendChild(th);
});

thead.appendChild(headerRow);
table.appendChild(thead);

const tbody = document.createElement("tbody");
tbody.id = "recentArticles";
table.appendChild(tbody);

container.appendChild(table);

document.body.appendChild(container);

async function getRecentArticles() {
  try {
    const response = await fetch(
      "http://127.0.0.1:5000/recent_articles"
    );
    const data = await response.json();
    console.log(data)
    tbody.innerHTML = "";

    data.forEach((article) => {
      const row = document.createElement("tr");

      const titleCell = document.createElement("td");
      titleCell.textContent = article.title;
      row.appendChild(titleCell);

      const keywordsCell = document.createElement("td");
      keywordsCell.textContent = article.keywords.join(", ");
      row.appendChild(keywordsCell);

      const dateCell = document.createElement("td");
      let date = new Date(article.published_time).toLocaleDateString();
      dateCell.textContent = date;
      row.appendChild(dateCell);

      const URLCell = document.createElement("td");
      URLCell.textContent = article.url;
      row.appendChild(URLCell);

      const journalCell = document.createElement("td");
      journalCell.textContent = article.journal;
      row.appendChild(journalCell);

      tbody.appendChild(row);
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
getRecentArticles();
