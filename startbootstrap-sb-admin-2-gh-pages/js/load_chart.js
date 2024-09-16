// Get the chart script name from the URL
const urlParams = new URLSearchParams(window.location.search);
const chartScript = urlParams.get("chart");
console.log(chartScript);

if (chartScript) {
  // Dynamically load the chart script
  const script = document.createElement("script");
  script.src = `${chartScript}`;
  document.body.appendChild(script);

  let div = document.getElementsByClassName("chartContainer")[0];
  let id = "";
  let words_temp_arr = chartScript.split("/");
  words_temp_arr = words_temp_arr[words_temp_arr.length - 1].split(".")[0].split("_");

  id += words_temp_arr[0];
  let title = words_temp_arr[0].charAt(0).toUpperCase() + words_temp_arr[0].slice(1) + " ";
  for (let i = 1; i < words_temp_arr.length; i++) {
    let word = words_temp_arr[i];
    id += word.charAt(0).toUpperCase() + word.slice(1);
    title += word.charAt(0).toUpperCase() + word.slice(1) + " ";  // Added space between words for better readability
  }

  // Update document title
  document.title = title.trim();  // Remove any trailing space

  let h1Element = document.querySelector("h1");
  if (h1Element) {
    h1Element.textContent = title.trim();  // Set the <h1> content
  }
  
  div.id = id;

  // Optionally, add an event listener to initialize the chart
  script.onload = () => {
    if (window.chartInstance) {
      window.chartInstance.renderTo(document.getElementsByClassName("chartContainer")[0]);
    }
  };
}
