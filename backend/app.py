# test_api.py

import requests
def main():
    api_url = 'https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json'

    try:
        print("Loading....")
        response = requests.get(api_url)
        response.raise_for_status()  # Raise an exception if the response status code is not 200
        data = response.json()
        size_of_data = len(data)
        
        # data is an array of dicts (ea dict is a row within dataset)
        
        set_of_congress = set()
        for x in range(size_of_data):
            entry = data[x]
            set_of_congress.add(entry['representative'])
        print("Welcome to Capitol Trades!  Enter 'x' to exit at any time..")
        cont = True
        while (cont):
            target_congress = input("Enter a congress member:")
            if (target_congress == "x"):
                cont = False
            elif (target_congress not in set_of_congress):
                print("Congress person not found..")
            
            else:
                for x in range(size_of_data):
                    entry = data[x]
                    if (entry['representative'] == target_congress):   
                        print(f"Entry {x + 1}: {entry['disclosure_year']}, {(entry['type']).upper()}: ({entry['ticker']}): {entry['amount']} | {entry['party']} Rep: {entry['representative']}")

    except Exception as e:
        print(f"Error fetching data: {e}")
        
    print("Done\n")
if __name__ == "__main__":
    main()
    