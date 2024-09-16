document.addEventListener("DOMContentLoaded", async () => {
    const buttonsContainer = document.getElementById("button-container");
  
    try {
      // Fetch the script names
      const response = await fetch("http://127.0.0.1:5000/get_scriptfiles_names");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Parse the response as JSON
      const chartScripts = await response.json();
      // Loop through each script and create a button
      chartScripts.forEach((script) => {
        console.log(script);
        const card = document.createElement("div");
        card.className = "mb-3 col-sm-6";
        let name_array = script.split("/");
        let temp_arr = name_array[name_array.length - 1].split(".")[0].split("_");
        console.log(temp_arr);
        let name = "";
        temp_arr.forEach((word) => {
            let formatted_word = word.charAt(0).toUpperCase() + word.slice(1) + " ";
            if (word != "articles" && word != "by" && word != "grouped"){
                name += formatted_word
            }
        });
        
        card.innerHTML = `
                        <div class="card">
                            <div class="card-body btn btn-outline-primary" onclick="loadChart('../../visualizations/scripts/${script}')">
                                ${name}
                            </div>
                        </div>
                    `;
        buttonsContainer.appendChild(card);
      });
    } catch (error) {
      console.error('Error fetching script files:', error);
    }
  });
  
  function loadChart(scriptName) {
    // Open blank.html and pass the script name
    window.location.href = `blank.html?chart=${scriptName}`;
  }
  