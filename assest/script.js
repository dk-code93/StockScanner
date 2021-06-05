const stockKey = `&apikey=BF997UXSJ2Q4JW3Y`;
// Stock Symbol
var searchSymbol = `TSLA`;
// Stock Data API URL
const dataAPI = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=` + searchSymbol + stockKey;

// Call Stock API
function callStock() {
    $.ajax({
    url: dataAPI,
    method: `GET`
  }).then(function(response){
    // All data API returned 
    console.log(response);

    stockData(response);
})};

function stockData(response) {
    //   Clear the card
    $(`#data`).val(``);
    //   Display new stock data
    $(`#data`).text(JSON.stringify(response));
}

//   Call functions
callStock();
// stockData();
// stockNews();
// stockGraph();