class Stock:
    def __init__(self, ticker, company_name):
        self.ticker = ticker
        self.company_name = company_name
        self.trades = {}
        self.total_volume = 0  # Initialize total_volume attribute

    def clean_amount(self, amount_str):
        cleaned_amount = amount_str.replace('$', '').replace(',', '')

        if ' - ' in cleaned_amount:
            return [int(val) for val in cleaned_amount.split(" - ") if val]  # Filter out empty strings
        elif '+' in cleaned_amount:
            return [int(cleaned_amount.replace('+', '').strip())]
        elif '-' in cleaned_amount:  # Handle the case of a single number followed by a hyphen
            return [int(cleaned_amount.replace('-', '').strip())]
        else:
            return [int(cleaned_amount.strip())]
    
    def add_trade(self, date, trade_type, amount_str):
        cleaned_amounts = self.clean_amount(amount_str)
        # Conditional if the string only has one dollar sign
        if amount_str.count("$") == 1:
            trade_amount = amount_str.split(' ')[0]
            amount_str = f"Less than {trade_amount}"
        if date in self.trades:
            self.trades[date].append((trade_type, cleaned_amounts, amount_str))
        else:
            self.trades[date] = [(trade_type, cleaned_amounts, amount_str)]

    def calculate_volume(self):
        self.total_volume = 0  # Reset total_volume attribute
        for trades_list in self.trades.values():
            for trade in trades_list:
                for amount in trade[1]:
                    self.total_volume += amount  # Sum the individual amounts within the range if present



def build_politician_graphs(data):
    politicians = {}
    for entry in data:
        name = entry['representative']
        if name not in politicians:
            politicians[name] = PoliticianGraph(name)
        if entry['ticker'] != "--":
            politicians[name].add_trade(
                entry['ticker'],
                entry['asset_description'],
                entry['disclosure_date'],
                entry['type'],
                entry['amount']
            )
        
    # Calculate total volume for each stock
    for politician_graph in politicians.values():
        for stock in politician_graph.stocks.values():
            stock.calculate_volume()
    return politicians


def build_politician_matrix(data, stock_list):
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



class PoliticianGraph:
    def __init__(self, name):
        self.name = name
        self.stocks = {}
        self.total_traded = 0
        self.total_volume = 0  # Initialize total volume to 0

    def add_trade(self, ticker, company_name, date, trade_type, amount):
        if ticker not in self.stocks:
            self.stocks[ticker] = Stock(ticker, company_name)
        if (trade_type == "sale_partial" or trade_type == "sale_full" or trade_type == "sale"):
            trade_type = "Sale"
        if (trade_type == "purchase"):
            trade_type = "Purchase"
        self.stocks[ticker].add_trade(date, trade_type, amount)



class PoliticianMatrix:
    def __init__(self, politicians, stock_list):
        self.politicians = politicians  #Politician list needed to initialize matrix
        self.politician_indices = {politician: i for i, politician in enumerate(politicians)}
        self.stock_list = stock_list  #Stock list needed to initialize matrix
        self.stock_indices = {stock.ticker: i for i, stock in enumerate(stock_list)}
        self.matrix = [[[] for _ in range(len(stock_list))] for _ in range(len(politicians))] #Matrix of [Politicians] x [Stock Tickers] where each cell holds trading information (2d list)

    def add_trade(self, politician, ticker, trade_info):
            if ticker in self.stock_indices and politician in self.politician_indices:
                row = self.politician_indices[politician]
                col = self.stock_indices[ticker]
                trade_info_with_amount_str = {
                    'date': trade_info['date'],
                    'type': trade_info['type'],
                    'amount': trade_info['amount'],
                    'company_name': trade_info['company_name']
                }
                self.matrix[row][col].append(trade_info_with_amount_str)

    def get_trades(self, politician):
        if politician in self.politician_indices:
            row = self.politician_indices[politician]
            trades = {}
            for ticker_index, trades_list in enumerate(self.matrix[row]):
                if trades_list:
                    ticker = self.stock_list[ticker_index].ticker
                    trades[ticker] = []
                    for trade in trades_list:
                        trades[ticker].append({
                            "date": trade['date'],
                            "trade_type": trade['type'],
                            "amount": trade['amount'],
                            "name": trade['company_name']
                        })
                        for i, trade in enumerate(trades[ticker]):
                            if trade['trade_type'] in ("sale_partial", "sale_full", "sale"):
                                trades[ticker][i]['trade_type'] = "Sale"
                            elif trade['trade_type'] == "purchase":
                                trades[ticker][i]['trade_type'] = "Purchase"
            return trades
        return None




       