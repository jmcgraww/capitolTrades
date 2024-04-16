

class TradeNode:
    def __init__(self, ticker, company_name):
        self.ticker = ticker
        self.company_name = company_name
        self.total_value = (0, 0)  # (holding, estimation)
        self.trades = {}  # key: date, value: (type, amount)

    def add_trade(self, date, trade_type, amount):
        if date in self.trades:
            self.trades[date].append((trade_type, amount))
        else:
            self.trades[date] = [(trade_type, amount)]

class PoliticianGraph:
    def __init__(self, name):
        self.name = name
        self.stocks = {}  # key: ticker, value: TradeNode

    def add_trade(self, ticker, company_name, date, trade_type, amount):
        if ticker not in self.stocks:
            self.stocks[ticker] = TradeNode(ticker, company_name)
        self.stocks[ticker].add_trade(date, trade_type, amount)
