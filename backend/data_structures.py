
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

def build_politician_matrix(data, stock_list):
    # Extract all unique politicians
    unique_politicians = set(entry['representative'] for entry in data if entry['representative'])
    matrix = PoliticianMatrix(list(unique_politicians), stock_list)

    for entry in data:
        if entry['ticker'] != "--" and entry['representative']:
            matrix.add_trade(
                entry['representative'],
                entry['ticker'], {
                    'date': entry['disclosure_date'],
                    'type': entry['type'],
                    'amount': entry['amount'],
                    'company_name': entry['asset_description']
                }
            )
    return matrix

class Stock:
    def __init__(self, ticker, company_name):
        self.ticker = ticker
        self.company_name = company_name
        self.min_value = 0
        self.max_value = 0
        self.trades = {}

    def clean_amount(self, amount_str):
        # Remove dollar signs and commas
        cleaned_amount = amount_str.replace('$', '').replace(',', '')

        # Check if it is a range or ends with '+'
        if ' - ' in cleaned_amount:
            # Replace ' - ' with a space to separate the numbers
            return cleaned_amount.replace(' - ', ' ').strip()
        elif '+' in cleaned_amount:
            # Remove the '+' and return the number
            return cleaned_amount.replace('+', '').strip()
        else:
            return cleaned_amount.strip()

    def add_trade(self, date, trade_type, amount_str):
        # Clean the amount string
        cleaned_amount = self.clean_amount(amount_str)

        # Print the cleaned amount (or you can process it as needed)
        # print(cleaned_amount)

        # Add the trade to the trades dictionary
        if date in self.trades:
            self.trades[date].append((trade_type, cleaned_amount))
        else:
            self.trades[date] = [(trade_type, cleaned_amount)]

class PoliticianGraph:
    def __init__(self, name):
        self.name = name
        self.stocks = {}

    def add_trade(self, ticker, company_name, date, trade_type, amount):
        if ticker not in self.stocks:
            self.stocks[ticker] = Stock(ticker, company_name)
        self.stocks[ticker].add_trade(date, trade_type, amount)

class PoliticianMatrix:
    def __init__(self, politicians, stock_list):
        self.politicians = politicians  # Keep track of the politician list
        self.politician_indices = {politician: i for i, politician in enumerate(politicians)}
        self.stock_list = stock_list  # Keep track of the stock list
        self.stock_indices = {stock.ticker: i for i, stock in enumerate(stock_list)}
        self.matrix = [[[] for _ in range(len(stock_list))] for _ in range(len(politicians))]

    def add_trade(self, politician, ticker, trade_info):
        if ticker in self.stock_indices and politician in self.politician_indices:
            row = self.politician_indices[politician]
            col = self.stock_indices[ticker]
            self.matrix[row][col].append(trade_info)

    def get_trades(self, politician):
        if politician in self.politician_indices:
            row = self.politician_indices[politician]
            trades = {}
            for ticker_index, trades_list in enumerate(self.matrix[row]):
                if trades_list:
                    ticker = self.stock_list[ticker_index].ticker
                    trades[ticker] = [
                        {
                            "date": trade['date'],
                            "trade_type": trade['type'],  # Ensure this matches the frontend expectation
                            "amount": trade['amount'],
                            "name": trade['company_name']
                        }
                        for trade in trades_list
                    ]
            return trades
        return None  # Return None if the politician is not found



       