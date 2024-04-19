class Stock: #Used to store information about a certain stock's interactions with a certain politician.  Not a general object for stocks, acts more like an instance of a stock that represents its interactions with one particular politician
    def __init__(self, ticker, company_name): #Initialize stock object with ticker and company name
        self.ticker = ticker
        self.company_name = company_name
        self.min_value = 0
        self.max_value = 0
        self.trades = {} #dictionary to store trades involving the stock

    def clean_amount(self, amount_str): #clean the amount string for use with min/max calculation
        
        cleaned_amount = amount_str.replace('$', '').replace(',', '')

        if ' - ' in cleaned_amount:
            return cleaned_amount.replace(' - ', ' ').strip()
        elif '+' in cleaned_amount:
            return cleaned_amount.replace('+', '').strip()
        else:
            return cleaned_amount.strip()

    def add_trade(self, date, trade_type, amount_str):
        
        cleaned_amount = self.clean_amount(amount_str)

        if date in self.trades: #store trades by date
            self.trades[date].append((trade_type, cleaned_amount))
        else:
            self.trades[date] = [(trade_type, cleaned_amount)]


def build_politician_graphs(data): #Build adjacency list of a politicians trades (map politicians to Stock objects, which hold individual trade information)
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

def build_politician_matrix(data, stock_list): #Build matrix of [Politicians] x [Stock tickers]
    # Extract all unique politicians
    unique_politicians = set(entry['representative'] for entry in data if entry['representative']) 
    matrix = PoliticianMatrix(list(unique_politicians), stock_list) #Use unique politicians and unique stock tickers as indices

    #NOTE - The politician matrix DOES use the Stock class to construct the matrix, but it happens at compile in 'server.py' when the list of unique stocks is initialized

    for entry in data: #Populate matrix cells (list inside a list inside a list) with information about trades between the politician and the stock
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

    def add_trade(self, ticker, company_name, date, trade_type, amount): #add a trade to the politicians adjacency list
        if ticker not in self.stocks: #if this particular ticker is not in the adjacency list yet, then initialize new Stock object for it
            self.stocks[ticker] = Stock(ticker, company_name)
        self.stocks[ticker].add_trade(date, trade_type, amount) #Add the trade, sorted with trades of the same ticker


class PoliticianMatrix:
    def __init__(self, politicians, stock_list):
        self.politicians = politicians  #Politician list needed to initialize matrix
        self.politician_indices = {politician: i for i, politician in enumerate(politicians)}
        self.stock_list = stock_list  #Stock list needed to initialize matrix
        self.stock_indices = {stock.ticker: i for i, stock in enumerate(stock_list)}
        self.matrix = [[[] for _ in range(len(stock_list))] for _ in range(len(politicians))] #Matrix of [Politicians] x [Stock Tickers] where each cell holds trading information (2d list)

    def add_trade(self, politician, ticker, trade_info): #Add trade info to a cell of the matrix
        if ticker in self.stock_indices and politician in self.politician_indices: #Locate correct row and col corresponding to politician and given ticker
            row = self.politician_indices[politician]
            col = self.stock_indices[ticker]
            self.matrix[row][col].append(trade_info) #Append trade info into the matrix cell

    def get_trades(self, politician): #Retrieve list of trades for a chosen politician
        if politician in self.politician_indices:
            row = self.politician_indices[politician] #If politician is found, look onto their row of the matrix to see trades
            trades = {}
            for ticker_index, trades_list in enumerate(self.matrix[row]): #Add trades to a dictionary with the following info: date, type of trade, amount traded, and name of the company traded with
                if trades_list:
                    ticker = self.stock_list[ticker_index].ticker
                    trades[ticker] = [
                        {
                            "date": trade['date'],
                            "trade_type": trade['type'],
                            "amount": trade['amount'],
                            "name": trade['company_name']
                        }
                        for trade in trades_list
                    ]
            return trades
        return None  #Return None if the politician is not found



       