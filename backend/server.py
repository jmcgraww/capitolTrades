
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from app import build_politician_graphs

app = Flask(__name__)
CORS(app)

# Load and build the graph once when the server starts
response = requests.get('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
data = response.json()
politician_graphs = build_politician_graphs(data)

@app.route('/search', methods=['GET'])
def search():
    search_term = request.args.get('term', '')  # Get search term from query string
    
    # Use the pre-built graph
    matches = [name for name in politician_graphs if search_term.lower() == name.lower()]
    return jsonify(matches)

@app.route('/trades/<name>', methods=['GET'])
def get_trades(name):
    # check if politican exists
    if name in politician_graphs:
        trades = {}
        # iterate through our tickers
        for ticker, node in politician_graphs[name].stocks.items():
            trade_details = []
            for date, trades_info in node.trades.items():
                for trade in trades_info:
                    trade_details.append({
                        "date": date,
                        "trade_type": trade[0],
                        "amount": trade[1],
                        "name": node.company_name
                    })
            trades[ticker] = trade_details  # Ensure it's an array
        return jsonify(trades)
    else:
        return jsonify({"error": "Politician not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)