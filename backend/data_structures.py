
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
