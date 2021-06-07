// Global Variables
const $searchBtn = $(`#searchBtn`);
const $searchStock = $(`#searchStock`);
const $stockGraph = $(`#stockGraph`);
// API Key
const stockKey = `&apikey=BF997UXSJ2Q4JW3Y`;
// Store user's searched stock symbols value
var searchSymbol = $searchStock.val();

// Lets user click search button with ENTER key
// When you press ENTER key within the stock search bar
$searchStock.keypress(function(event) {
  // Only if user pressed the enter key
  if (event.keyCode === 13) {
    // Click search button
    $searchBtn.click(); 
  } 
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
  makeList();

 // Clear the value of the search box
 $searchStock.val(``);
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
function makeList() {
  // Create list elements with a bootstrap class and text of user entered city
  const listStock = $(`<li>`).addClass(`list-group-item`);
  // Create a button to go into the list item
  const historyBtn = $(`<button>`).addClass(`btn btn-info`).attr(`type`, `button`).attr(`data-value`, searchSymbol).text(searchSymbol);
  listStock.append(historyBtn);
  // Put the listStock content into any list-group class's
  $(`#history`).append(listStock);
  localStorage.setItem(`list`, listStock);
};

// Click listener for the history buttons searches for the stock
$(`#history`).on('click', function(event) {
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
