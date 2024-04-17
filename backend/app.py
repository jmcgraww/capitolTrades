from data_structures import Stock, PoliticianGraph
import requests

def build_politician_graphs(data):
    politicians = {}
    for entry in data:
        name = entry['representative']
        if name not in politicians:
            politicians[name] = PoliticianGraph(name)
        # rare edge case of data not having an associated symbol
        if entry['ticker'] != "--":
            politicians[name].add_trade(
                entry['ticker'],
                entry['asset_description'],
                entry['disclosure_date'],
                entry['type'],
                entry['amount']
            )
    return politicians

def main():
    api_url = 'https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json'

    try:
        print("Loading....")
        response = requests.get(api_url)
        response.raise_for_status()  # Raise an exception if the response status code is not 200
        data = response.json()
        
        # Build graphs for each politician from data
        politician_graphs = build_politician_graphs(data)

        print("Welcome to Capitol Trades! Enter 'x' to exit at any time.")
        cont = True
        while (cont):
            target_congress = input("Enter a congress member: ")
            
            if target_congress not in politician_graphs:
                print("Congress person not found..")
            else:
                print(f"Trades for {target_congress}:")
                for ticker, node in politician_graphs[target_congress].stocks.items():
                    print(f"{ticker} ({node.company_name}):")
                    for date, trades in node.trades.items():
                        for trade in trades:
                            print(f"  Date: {date}, Type: {trade[0]}, Amount: {trade[1]}")

    except Exception as e:
        print(f"Error fetching data: {e}")

    print("Done\n")

if __name__ == "__main__":
    main()