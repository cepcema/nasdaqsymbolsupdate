from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/scrape', methods=['GET'])
def scrape_data():
    # URL to scrape
    url = "http://www.nasdaqtrader.com/dynamic/SymDir/TradingSystemAddsDeletes.txt"

    # Fetching the webpage
    response = requests.get(url)

    # Checking if the request was successful
    if response.status_code == 200:
        # Splitting the text content into lines
        lines = response.text.strip().split('\n')

        # Initializing list to store scraped data
        data_list = []

        # Parsing each line of the text content
        for line in lines:
            # Extracting data from each line
            data = line.strip().split('|')
            if len(data) >= 7:  # Ensure data contains at least 7 elements
                data_list.append({
                    "Symbol": data[0],
                    "Company Name": data[1],
                    "NASDAQ Action": data[2],
                    "BX Action": data[3],
                    "PSX Action": data[4],
                    "Effective Date": data[5],
                    "Primary Listing Market": data[6]
                })
            else:
                print("Incomplete data:", data)  # Log incomplete data

        return jsonify(data_list)
    else:
        return jsonify({"error": "Failed to fetch the webpage"}), 500

if __name__ == '__main__':
    app.run(debug=True)
