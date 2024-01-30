// Punctuality widget that should:

//Display rostered times for specific dates
//Display if corresponding actual time was on time, or if there was an issue with it
//Hover over actual time comment to see what the actual time was

// */ *//

// Variables to store urls and data to be fetched
// Event listener to the HTML form where user inserts a specific date
let form = document.querySelector("#search-date");

form.addEventListener("submit", getUrls);
let rosterUrl = "";
let shiftUrl = "";
let rosteredInfo = null;
let shiftInfo = null;

// Function to get input (date) from user and convert it into URLs
function getUrls(event) {
  event.preventDefault();
  let date = document.querySelector("#search-input").value;
  rosterUrl = `http://127.0.0.1:4567/roster/${date}`;
  shiftUrl = `http://127.0.0.1:4567/shift/${date}`;

  //Callinf fetchData funtion to fetch data from the server
  fetchData();
}

// Async funtion to fetch data from the server, convert it into an object and send data to displayInfo function
async function fetchData() {
  await Promise.all([
    fetch(rosterUrl)
      .then((response) => response.json())
      .then((response) => {
        rosteredInfo = JSON.stringify(response);
        rosteredInfoObject = JSON.parse(rosteredInfo);
      }),
    fetch(shiftUrl)
      .then((response) => response.json())
      .then((response) => {
        shiftInfo = JSON.stringify(response);
        shiftInfoObject = JSON.parse(shiftInfo);
        displayInfo(rosteredInfoObject, shiftInfoObject);
      }),
  ]);
}

// Function to populate the table with fetched data
function displayInfo(data1, data2) {
  let date = data1[0]["date"];
  let htmlTable = document.getElementById("table");
  let newRow = document.createElement("tr");
  let dateCell = document.createElement("td");
  let rosteredStartCell = document.createElement("td");
  let actualStartCell = document.createElement("td");
  actualStartCell.setAttribute(`id`, `${date}`);
  let rosteredFinishCell = document.createElement("td");
  let actualFinishCell = document.createElement("td");
  actualFinishCell.setAttribute(`id`, `${date}`);
  htmlTable.appendChild(newRow);
  newRow.appendChild(dateCell);
  newRow.appendChild(rosteredStartCell);
  newRow.appendChild(actualStartCell);
  newRow.appendChild(rosteredFinishCell);
  newRow.appendChild(actualFinishCell);
  dateCell.innerHTML = data1[0]["date"];

  rosteredStartCell.innerHTML = data1[0]["start"].replace(`${date} `, ``).replace(`+10`, ``);
  rosteredFinishCell.innerHTML = data1[0]["finish"].replace(`${date} `, ``).replace(`+10`, ``);

  // if the actual start of work is the same that the rosted time, display "on time"
  if (data1[0]["start"] == data2[0]["start"]) {
    actualStartCell.innerHTML = "on time";
    // else, add tooltip -- when hover over the text, display the actual time of start/finish of work
  } else {
    let tooltipStart = document.createElement("div");
    tooltipStart.setAttribute("class", "tooltip");
    tooltipStart.innerHTML = "late or early";
    let tooltipStartText = document.createElement("span");
    tooltipStartText.setAttribute("class", "tooltiptext");
    actualStartCell.appendChild(tooltipStart);
    tooltipStart.appendChild(tooltipStartText);
    tooltipStartText.innerHTML = data2[0]["start"].replace(`${date} `, ``).replace(`+10`, ``);
  }

  if (data1[0]["finish"] == data2[0]["finish"]) {
    actualFinishCell.innerHTML = "on time";
  } else {
    let tooltip = document.createElement("div");
    tooltip.setAttribute("class", "tooltip");
    tooltip.innerHTML = "late or early";
    let tooltipText = document.createElement("span");
    tooltipText.setAttribute("class", "tooltiptext");
    actualFinishCell.appendChild(tooltip);
    tooltip.appendChild(tooltipText);
    tooltipText.innerHTML = data2[0]["finish"].replace(`${date} `, ``).replace(`+10`, ``);
  }
}
