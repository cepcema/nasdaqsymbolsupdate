// Import necessary modules
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Function to make an HTTP request
function httpRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

// Function to process the response and extract data
function processData(data) {
    // Split the data into lines
    var lines = data.split("\n");

    // Remove the header and footer lines
    lines = lines.filter(function(line) {
        return !line.includes("Symbol|Company Name|NASDAQ Action");
    });
    lines = lines.filter(function(line) {
        return !line.includes("File Creation Time:");
    });

    var jsonData = [];

    lines.forEach(function(line) {
        var columns = line.split("|");

        // Ensure each column exists before trimming
        var symbol = columns[0] ? columns[0].trim() : '';
        var companyName = columns[1] ? columns[1].trim() : '';
        var status = columns[2] ? columns[2].trim() : '';

        jsonData.push({
            symbol: symbol,
            companyName: companyName,
            status: status
        });
    });

    return jsonData;
}

// Define the function to retrieve and return parsed JSON data
function getData(callback) {
    // URL of the proxy server
    var proxyUrl = "https://api.allorigins.win/raw?url=";

    // URL of the data source
    var url = proxyUrl + encodeURIComponent("http://www.nasdaqtrader.com/dynamic/SymDir/TradingSystemAddsDeletes.txt");

    // Make the HTTP request and process the response
    httpRequest(url, function(data) {
        var jsonData = processData(data);
        callback(jsonData);
    });
}

// Export the function to be used as an API endpoint
module.exports = getData;
