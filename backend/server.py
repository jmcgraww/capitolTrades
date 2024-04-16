from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from app import build_politician_graphs
from datetime import datetime

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
    matches = [name for name in politician_graphs if search_term.lower() in name.lower()]
    return jsonify(matches)

@app.route('/trades/<name>', methods=['GET'])
def get_trades(name):
    if name in politician_graphs:
        trades = []
        for ticker, node in politician_graphs[name].stocks.items():
            for date, trades_info in node.trades.items():
                for trade in trades_info:
                    trades.append({
                        "ticker": ticker,
                        "company_name": node.company_name,
                        "date": date,
                        "trade_type": trade[0],
                        "amount": trade[1]
                    })
        # Convert date strings to datetime objects and sort descending
        trades.sort(key=lambda x: datetime.strptime(x['date'], '%m/%d/%Y'), reverse=True)
        return jsonify(trades)
    else:
        return jsonify({"error": "Politician not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
