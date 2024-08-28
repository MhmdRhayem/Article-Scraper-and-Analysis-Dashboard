const inputContainer = document.createElement("div");
inputContainer.className = "input-container";

const postIdInput = document.createElement("input");
postIdInput.type = "text";
postIdInput.id = "postIdInput";
postIdInput.placeholder = "Enter Article ID";
inputContainer.appendChild(postIdInput);

const buttonFetchArticleDetails = document.createElement("button");
buttonFetchArticleDetails.id = "buttonFetchArticleDetails";
buttonFetchArticleDetails.textContent = "Fetch Data";
buttonFetchArticleDetails.classList.add("fetchButton");
inputContainer.appendChild(buttonFetchArticleDetails);

document.body.insertBefore(inputContainer, document.getElementById("chartdiv"));

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
tbody.id = "articleTableBody";
table.appendChild(tbody);

container.appendChild(table);

document.body.appendChild(container);

async function fetchAndPopulateTable(postid) {
  try {
    const response = await fetch(
      "http://127.0.0.1:5000/article_details/" + postid
    );
    const data = await response.json();

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

document.getElementById("buttonFetchArticleDetails").addEventListener("click", function () {
  const postid = document.getElementById("postIdInput").value;
  fetchAndPopulateTable(postid);
});
