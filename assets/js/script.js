// Global Variables
const $searchBtn = $(`#searchBtn`);
const $searchStock = $(`#searchStock`);
const $stockGraph = $(`#stockGraph`);
// API Key
const stockKey = `&apikey=BF997UXSJ2Q4JW3Y`;
// Store user's searched stock symbols value
var searchSymbol = $searchStock.val();

// Array to be used for saving and loading search history
const historyArray = [];
// Load search history from local storage and add it to the history list
const savedHistory = JSON.parse(localStorage.getItem(`list`));
if (savedHistory) {
    // Unhide the search history card
    $(`#historyCard`).removeClass(`hide`);
    for (let i = 0; i < savedHistory.length; i++) {
        historyArray.push(savedHistory[i]);
        makeList(historyArray[i]);
    }
}

// Lets user click search button with ENTER key
// When you press ENTER key within the stock search bar
$searchStock.keypress(function(event) {
  // Only if user pressed the enter key
  if (event.keyCode === 13) {
    // Click search button
    $searchBtn.click(); 
  } 
});

// Forces user input in search box to auto-capitalize
jQuery(document).ready(function($) {
  $searchStock.keyup(function(event) {
      const textBox = event.target;
      const start = textBox.selectionStart;
      const end = textBox.selectionEnd;
      textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1).toUpperCase();
      textBox.setSelectionRange(start, end);
  })
});

// On search button click
$searchBtn.on(`click`, function(event) {
  // Prevent page from clearing data
  event.preventDefault();
  // Show search history
  $(`.card`).removeClass(`hide`);
  // Get value stored in search box from user input
  searchSymbol = $searchStock.val();

  // Display stock graph
  callGetGraph();
  // Display stock data
  callStockData();
  // Creates history list
  makeList(searchSymbol);

 // Clear the value of the search box
 $searchStock.val(``);
 // Add the search key to the history array
 historyArray.push(searchSymbol);
 // Save the history array to local storage
 localStorage.setItem(`list`, JSON.stringify(historyArray));
});

function callGetGraph() {
  // Stock Graph API URL
  const graphAPI = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=` + searchSymbol + `&outputsize=compact` + stockKey;

  $.ajax({
    url: graphAPI,
    method: `GET`
  }).then(function(response){
    // All Graph API returned 
    console.log(response);

    // Call getGraph function with JSON response
    getGraph(response);
  })
};

function callStockData() {
  // Stock Data API URL
  const dataAPI = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=` + searchSymbol + stockKey;

  // Call Stock Data API
  $.ajax({
    url: dataAPI,
    method: `GET`
  }).then(function(response){
    // All data API returned 
    console.log(response);

    // Display new stock data
    $(`#data`).text(JSON.stringify(response));
  })
};

// Create Stock History
function makeList(string) {
  // Create list elements with a bootstrap class and text of user entered city
  const listStock = $(`<li>`).addClass(`list-group-item`);
  // Create a button and put it into the list item
  const historyBtn = $(`<button>`).addClass(`btn btn-info`).attr(`type`, `button`).attr(`data-value`, string).text(string);
  listStock.append(historyBtn);
  // Put the listStock content into any list-group class's
  $(`#historyList`).append(listStock);
};

// Click listener for the history buttons searches for the stock
$(`#historyList`).on('click', function(event) {
    const element = event.target;
    if (element.matches("button")) {
        searchSymbol = element.getAttribute('data-value');
        // Display stock graph
        callGetGraph();
        // Display stock data
        callStockData();
    }
});

function getGraph(response) {
  // Get the date properties from the API response object
  const APIdates = Object.keys(response[`Time Series (Daily)`]);
  // Create an array of the last 10 dates
  let datesArray = [];
  for (let i = 0; i < 10; i++) {
      const date = moment(APIdates[i], `YYYY-MM-DD`).format(`MMM-D`);
      datesArray.unshift(date);
  }
  // Create an array of the last 10 values
  let valueArray = [];
  for (let i = 0; i < 10; i++) {
      const date = APIdates[i];
      // Add the corresponding date values to an array
      valueArray.unshift(response[`Time Series (Daily)`][`${date}`][`4. close`]);
  }
  // Creates a graph object based on data received
  const graphObj = {
      type: 'line',
      data: {
        labels: datesArray,
        datasets: [{
          label: `${searchSymbol}`,
          data: valueArray
        }]
      }
  }
  // Creates an img html element linked to the graph
  const graphIMG = $(`<img>`).addClass(`img-fluid`).attr(`alt`, `graph`).attr(`src`, `https://quickchart.io/chart?c=${JSON.stringify(graphObj)}`);
  // Remove old graph
  $stockGraph.children().remove();
  // Appends the graph to the page
  $stockGraph.append(graphIMG);
}
