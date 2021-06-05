const stockKey = `&apikey=BF997UXSJ2Q4JW3Y`;
// Stock Symbol searched
var searchSymbol = $(`#searchStock`).val();
// Stock Data API URL
const dataAPI = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=` + searchSymbol + stockKey;

// Lets user click search button with ENTER key
// When you press ENTER key within the stock search bar
$(`#searchStock`).keypress(function(event) {
  // Only if user pressed the enter key
  if (event.keyCode === 13) { 
      // Prevent user text from resetting
  event.preventDefault();
      // Click search button
  $(`#searchBtn`).click(); 
  } 
});

// On search button click
$(`#searchBtn`).on(`click`, function() {
  // Display stock data
  callStock();

});

// Call Stock API
function callStock() {
    $.ajax({
    url: dataAPI,
    method: `GET`
  }).then(function(response){
    // All data API returned 
    console.log(response);

    stockData(response);
  })
};

function stockData(response) {
    //   Clear the card
    $(`#data`).val(``);
    //   Display new stock data
    $(`#data`).text(JSON.stringify(response));
};

//   Call functions
// callStock();
// stockData();
// stockNews();
// stockGraph();