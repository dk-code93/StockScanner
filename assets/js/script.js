const $searchBtn = $("#searchBtn");
const $searchInput = $("#searchInput");
const $liveStock = $("#liveStock");
const stockKey = `&apikey=BF997UXSJ2Q4JW3Y`;
// Stock Symbol
var searchSymbol = `TSLA`;
// Stock Data API URL
const dataAPI = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=` + searchSymbol + `&outputsize=compact` + stockKey;

// Call Stock API
function callStock() {
    $.ajax({
    url: dataAPI,
    method: `GET`
  }).then(function(response){
    // All data API returned 
    console.log(response);

    stockData(response);

    getGraph(response);
})};

function stockData(response) {
    //   Clear the card
    $(`#data`).val(``);
    //   Display new stock data
    $(`#data`).text(JSON.stringify(response));

}

function getGraph(response) {
    // Get the date properties from the API response object
    const APIdates = Object.keys(response[`Time Series (Daily)`]);
    // Create an array of the last 10 dates
    let datesArray = [];
    for (let i = 0; i < 10; i++) {
        const date = moment(APIdates[i], "YYYY-MM-DD").format("MMM-D");
        datesArray.unshift(date);
    }
    // Create an array of the last 10 values
    let valueArray = [];
    for (let i = 0; i < 10; i++) {
        const date = APIdates[i];
        // Add the corresponding date values to an array
        valueArray.unshift(response[`Time Series (Daily)`][`${date}`][`4. close`]);
    }
    console.log(valueArray);
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
    const graphIMG = $("<img>").addClass("img-fluid").attr("alt", "graph").attr("src", `https://quickchart.io/chart?c=${JSON.stringify(graphObj)}`);
    // Appends the graph to the page
    $liveStock.append(graphIMG);
}

// Button calls stock
$searchBtn.on('click', function(event) {
    event.preventDefault();
    callStock();
});