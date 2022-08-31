// Global Variables
const $searchBtn = $(`#searchBtn`);
const $searchStock = $(`#searchStock`);
const $stockGraph = $(`#stockGraph`);
// API Key
const stockKey = `&apikey=0GM6A49EJPD85AOD`;
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
$searchBtn.on(`click`, async function(event) {
  // Prevent page from clearing data
  event.preventDefault();
  
  // Get value stored in search box from user input
  searchSymbol = $searchStock.val();

  // End the function if nothing is entered 
  if (!searchSymbol) {
    return; }

  // Display stock graph
  const check = await getStock();

  saveData(check);

  // Clear the value of the search box
  $searchStock.val(``);

 return;
});

function getStock() {
  // Stock Graph API URL
  const graphAPI = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=` + searchSymbol + `&outputsize=compact` + stockKey;

  return $.ajax({
    url: graphAPI,
    method: `GET`
  }).then(function(response){
    // All Graph API returned 
    console.log(response);

    // Check for an error message in the response
    if (response[`Error Message`]) {
        // If an error message is found, end the function
        console.log(`oopsies`);
        return 404;
    } else {
        // Call displayStock function with JSON response
        displayStock(response);
        return;
    }
  });

};

// Create Stock History
function makeList(string) {
  // Create a button and put it into the list item
  const historyBtn = $(`<button>`).addClass(`btn btn-info`).attr(`type`, `button`).attr(`data-value`, string).text(string);
  // Put the listStock content into any list-group class's
  $(`#historyList`).prepend(historyBtn);
};

// Click listener for the history buttons searches for the stock
$(`#historyList`).on('click', function(event) {
    const element = event.target;
    if (element.matches("button")) {
        searchSymbol = element.getAttribute('data-value');
        // Display stock graph
        getStock();
    }
});

function displayStock(response) {
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

   // Put the stock values in an array
   const today = response[`Time Series (Daily)`][`${APIdates[0]}`];
   const stockProperties = Object.keys(today);
   //  Display the current day values in the `Current Stock Data`
   $(`#data`).removeClass(`hide`);
   for (let i = 0; i < 5; i++) {
     $(`#data`).children().eq(i).children().text(`${today[`${stockProperties[i]}`]}`);
   }

  return;
}

function saveData(response) {
  if (response === 404) {
    // Remove old graph
    $stockGraph.children().remove();
    // Create a message
    const error1 = $(`<h1>`).text(`404`);
    const error2 = $(`<h2>`).text(`We couldn't find that stock...`);
    const error3 = $(`<p>`).text(`Try using the "Ticker Symbol Lookup" link to find a symbol`);
    // Append message to jumbotron
    $stockGraph.append(error1).append(error2).append(error3);
    return;
  } else if (historyArray.includes(searchSymbol)) {
    console.log('already there');
    return;
  } else {
    // Creates history list button
    makeList(searchSymbol);
    // Add the search key to the history array
    historyArray.push(searchSymbol);
    // Once you hit 15 searches, remove the oldest entry
    if (historyArray.length > 15) {
       historyArray.shift();
       $(`#historyList`).last().remove();
    }
    // Save the history array to local storage
    localStorage.setItem(`list`, JSON.stringify(historyArray));
  }
}