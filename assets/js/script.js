// API Key
const stockKey = `&apikey=BF997UXSJ2Q4JW3Y`;
// Store user's searched stock symbols value
var searchSymbol = $(`#searchStock`).val();

// Lets user click search button with ENTER key
// When you press ENTER key within the stock search bar
$(`#searchStock`).keypress(function(event) {
  // Only if user pressed the enter key
  if (event.keyCode === 13) {
    // Click search button
    $(`#searchBtn`).click(); 
  } 
});

// On search button click
$(`#searchBtn`).on(`click`, function(event) {
  // Prevent page from clearing data
  event.preventDefault();
  // Show search history
  $(`.card`).removeClass(`hide`);
  // Get value stored in search box from user input
  searchSymbol = $(`#searchStock`).val();

  // Display stock graph
  // getGraph(response);

  // Display stock data
  callStockData();

  // Display company news
  // callStockNews();

  // Creates history list
  makeList();

 // Clear the value of the search box
 searchSymbol = $(`#searchStock`).val(``);
});

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

    // Call stockData function with JSON response
    stockData(response);
  })
};

function stockData(response) {
  //   Display new stock data
  $(`#data`).text(JSON.stringify(response));
};

// Create Stock History
function makeList() {
  // Create list elements with a bootstrap class and text of user entered city
  const listStock = $(`<li>`).addClass(`list-group-item`).attr(`data-value`, searchSymbol).text(searchSymbol);
  // Put the listStock content into any list-group class's
  $(`.list-group`).append(listStock);
  localStorage.setItem(`list`, listStock);
};