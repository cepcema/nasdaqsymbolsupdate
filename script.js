// Import necessary modules
const fetch = require('node-fetch');

// Function to make an HTTP request and return parsed JSON data
async function getData() {
    try {
        // URL of the data source
        const url = "http://www.nasdaqtrader.com/dynamic/SymDir/TradingSystemAddsDeletes.txt";
        
        // Fetch data from the URL
        const response = await fetch(url);
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        // Extract text data from response
        const data = await response.text();
        
        // Split the data into lines
        const lines = data.trim().split("\n");
        
        // Remove header and footer lines
        const filteredLines = lines.filter(line => !line.includes("Symbol|Company Name|NASDAQ Action") && !line.includes("File Creation Time:"));
        
        // Parse each line and create JSON objects
        const jsonData = filteredLines.map(line => {
            const [symbol, companyName, status] = line.split("|").map(item => item.trim());
            return { symbol, companyName, status };
        });
        
        // Return the parsed JSON data
        return jsonData;
    } catch (error) {
        // Handle errors
        console.error('Error:', error.message);
        return null;
    }
}

// Export the function to be used as an API endpoint
module.exports = getData;
