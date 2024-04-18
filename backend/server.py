from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from data_structures import build_politician_graphs, Stock, build_politician_matrix

app = Flask(__name__)
CORS(app)

# Load data once when the server starts
response = requests.get('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
data = response.json()

# Build unique stock list
unique_stocks = {entry['ticker']: Stock(entry['ticker'], entry['asset_description']) for entry in data if entry['ticker'] != "--"}
stock_list = list(unique_stocks.values())

# Initialize both data structures (empty initially)
politician_graphs = None
politician_matrix = None

@app.route('/search', methods=['GET'])
def search():
    search_term = request.args.get('term', '').lower()
    data_structure = request.args.get('data_structure', 'list')

    global politician_graphs, politician_matrix  # Change to singular matrix

    if data_structure == 'matrix':
        if not politician_matrix:
            politician_matrix = build_politician_matrix(data, stock_list)
        structure = {pol: idx for idx, pol in enumerate(politician_matrix.politician_indices)}
    else:
        if not politician_graphs:
            politician_graphs = build_politician_graphs(data)
        structure = politician_graphs

    # Search logic for matrix
    matches = [name for name in structure if search_term == name.lower()]
    return jsonify(matches)

@app.route('/trades/<name>', methods=['GET'])
def get_trades(name):
    data_structure = request.args.get('data_structure', 'list')

    # Select the structure based on the parameter
    if data_structure == 'matrix':
        structure = politician_matrix
        if structure:
            trades = structure.get_trades(name)
            if trades is not None:
                return jsonify(trades)
            else:
                return jsonify({"error": "Politician not found"}), 404
    else:
        structure = politician_graphs
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
                            "name": node.company_name
                        })
                trades[ticker] = trade_details
            return jsonify(trades)
        else:
            return jsonify({"error": "Politician not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
