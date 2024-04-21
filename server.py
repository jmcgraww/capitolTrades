from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from data_structures import build_politician_graphs, Stock, build_politician_matrix
import time

app = Flask(__name__)
CORS(app)

# Load data once when the server starts
response = requests.get('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
data = response.json()

# Build unique stock list out of 'Stock' objects for use as axis in politician matrix
unique_stocks = {entry['ticker']: Stock(entry['ticker'], entry['asset_description']) for entry in data if entry['ticker'] != "--"}
stock_list = list(unique_stocks.values())

# Initialize both data structures (empty initially)
politician_graphs = None
politician_matrix = None

@app.route('/search', methods=['GET'])
def search():
    search_term = request.args.get('term', '').lower()
    data_structure = request.args.get('data_structure', 'list') # Decide which data structure to use based on the users choice (default is list)

    global politician_graphs, politician_matrix

    query_time = None  # Initialize query_time variable

    if data_structure == 'matrix': # If the chosen data structure is the matrix and it is not populated yet, then build the matrix
        if not politician_matrix:
            start_time = time.time()
            politician_matrix = build_politician_matrix(data, stock_list)
            end_time = time.time()
            query_time = (end_time - start_time) * 1000  # Convert to milliseconds
        structure = {pol: idx for idx, pol in enumerate(politician_matrix.politician_indices)}
    else: # Same process but if user chooses the adjacency list option instead
        if not politician_graphs:
            start_time = time.time()
            politician_graphs = build_politician_graphs(data)
            end_time = time.time()
            query_time = (end_time - start_time) * 1000  # Convert to milliseconds
        structure = politician_graphs

    # Search logic for matrix
    matches = [name for name in structure if search_term == name.lower()] # Return politician with the chosen name that is found in the chosen data structure
    return jsonify(matches), 200, {'Query-Time': query_time}

@app.route('/trades/<name>', methods=['GET'])
def get_trades(name):
    data_structure = request.args.get('data_structure', 'list') 

    # Select the structure based on the parameter
    if data_structure == 'matrix': # If chosen data structure is a matrix, then use get_trades function to gather trade information
        structure = politician_matrix
        if structure:
            trades = structure.get_trades(name)
            if trades is not None:
                return jsonify(trades)
            else:
                return jsonify({"error": "Politician not found"}), 404
    else:
        structure = politician_graphs # If chosen data structure is adjacency list, then create a dictionary to store the trade information NOTE - this should be turned into its own get_trades function for simplicity
        if structure and name in structure:
            trades = {}
            for ticker, node in structure[name].stocks.items():
                trade_details = []
                for date, trades_info in node.trades.items():
                    for trade in trades_info:
                        trade_details.append({
                            "date": date,
                            "trade_type": trade[0],
                            "amount": trade[1],
                            "amount_str": trade[2],
                            "name": node.company_name
                        })
                trades[ticker] = trade_details
            return jsonify(trades)
        else:
            return jsonify({"error": "Politician not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
