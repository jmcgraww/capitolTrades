import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CongressTrades = () => {
  const [inputValue, setInputValue] = useState('');
  const [congressMember, setCongressMember] = useState('');
  const [trades, setTrades] = useState({});
  const [visibleTrades, setVisibleTrades] = useState({});
  const [prevVisibleTrades, setPrevVisibleTrades] = useState({});
  const [error, setError] = useState('');
  const [dataStructure, setDataStructure] = useState(null);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [queryTime, setQueryTime] = useState(null);
  const expandedRef = useRef(null);

  useEffect(() => {
    const scrollToExpandedInfo = () => {
      Object.keys(visibleTrades).forEach((ticker) => {
        if (!prevVisibleTrades[ticker] && visibleTrades[ticker]) {
          const buttonRef = document.getElementById(`button-${ticker}`);
          if (buttonRef && expandedRef.current) {
            const searchBarRect = document.getElementById('search-bar').getBoundingClientRect();
            const buttonRect = buttonRef.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const buttonTop = buttonRect.top - searchBarRect.height - windowHeight / 10;
            if (buttonTop > window.pageYOffset) {
              window.scrollTo({
                top: buttonTop,
                behavior: 'smooth',
              });
            }
          }
        }
      });
      // Update previous visibility state
      setPrevVisibleTrades(visibleTrades);
    };
  
    scrollToExpandedInfo(); // Call the function defined within useEffect
  }, [visibleTrades]); // Since scrollToExpandedInfo is defined inside useEffect, it does not need to be a dependency
  
  const handleSearch = async () => {
    try {
      const startTime = performance.now(); // Start measuring time
      const response = await axios.get('/search', {
        params: { term: inputValue, data_structure: dataStructure },
      });
      const endTime = performance.now(); // End measuring time
      setQueryTime((endTime - startTime).toFixed(2)); // Calculate and set query time
      if (response.data.length > 0) {
        setSearchBarVisible(true);
        fetchTrades(response.data[0]);
      } else {
        setTrades([]);
        setError('Congress person not found.');
        setCongressMember('');
      }
    } catch (error) {
      setError('Error fetching data. Please try again later.');
      setTrades([]);
      setCongressMember('');
    }
  };
  
  const fetchTrades = async (name) => {
    try {
      const response = await axios.get(`/trades/${name}`, {
        params: { data_structure: dataStructure },
      });
      const fetchedTrades = response.data;
  
      // Adjust the handling of 'amount_str' based on whether it exists
      Object.keys(fetchedTrades).forEach(ticker => {
        fetchedTrades[ticker] = fetchedTrades[ticker].map(trade => {
          if (!trade.amount_str) { // Only compute if 'amount_str' doesn't already exist
            let amountStr = trade.amount.replace(/\s+/g, '');
            if (amountStr.includes('-')) {
              let amounts = amountStr.split('-').map(x => x.trim());
              amountStr = amounts.join(' - '); // Ensure clean formatting
            }
            return {
              ...trade,
              amount_str: amountStr
            };
          }
          return trade; // Return trade as is if 'amount_str' exists
        });
      });

      // Sort tickers based on total volume
      const sortedTickers = Object.keys(fetchedTrades).sort((a, b) => {
        const volumeA = calculateTotalVolume(fetchedTrades[a]);
        const volumeB = calculateTotalVolume(fetchedTrades[b]);
        return volumeB - volumeA;
      });
  
      // Update trades state with sorted tickers
      const sortedTrades = {};
      sortedTickers.forEach(ticker => {
        sortedTrades[ticker] = fetchedTrades[ticker];
      });
  
      setTrades(sortedTrades);
      setCongressMember(name);
      setError('');
    } catch (error) {
      setError('Error fetching trades. Please try again later.');
      setTrades([]);
    }
  };

  const toggleTradeVisibility = (ticker) => {
    setVisibleTrades((prevVisibleTrades) => ({
      ...prevVisibleTrades,
      [ticker]: !prevVisibleTrades[ticker],
    }));
  };

  const calculateTotalVolume = (trades) => {
    let totalVolume = 0;
  
    if (typeof trades !== 'object' || trades === null) {
      return totalVolume.toLocaleString();
    }
  
    const processTrade = (trade) => {
      console.log('Processing trade:', trade);
      if (trade.amount) {
        const amounts = parseAmount(trade.amount);
        console.log('Parsed amounts:', amounts);
        const volume = calculateVolumeFromAmounts(amounts);
        if (!isNaN(volume)) {
          totalVolume += volume;
        } else {
          console.error('Calculated NaN volume for amounts:', amounts);
        }
      } else {
        console.error('No amount provided in trade:', trade);
      }
    };
  
    Object.values(trades).forEach(tradeList => {
      if (Array.isArray(tradeList)) {
        tradeList.forEach(processTrade);
      } else if (tradeList && typeof tradeList === 'object') {
        processTrade(tradeList);
      } else {
        console.error('Unexpected trade data format:', tradeList);
      }
    });
  
    return totalVolume.toLocaleString();
  };
  

  function parseAmount(amount) { //helper function to decide between matrix/list volume calculation
    if (Array.isArray(amount)) {
      return amount.filter(num => !isNaN(num)); // Return the array if it's already numbers
    } else if (typeof amount === 'string') {
      let cleanAmount = amount.replace(/[$,]/g, '').trim();
      if (cleanAmount.endsWith('-')) {
        cleanAmount = cleanAmount.slice(0, -1).trim();
      }
      return cleanAmount.split(' - ')
        .map(Number)
        .filter(num => !isNaN(num)); // Filter out NaN values
    } else {
      console.error('Unexpected amount type:', amount);
      return [];
    }
  }
  
  function calculateVolumeFromAmounts(amounts) { //helper function to calculate volume using array structure (outputted from adj list)
    if (amounts.length === 2) {
      return (amounts[0] + amounts[1]) / 2;
    } else if (amounts.length === 1) {
      return amounts[0];
    }
    return 0; // Return zero if no valid numbers are found
  }
  
  return (
    <div>
      <h1 style={{ marginTop: '60px', marginBottom: '30px' }}>Capitol Trades</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {!searchBarVisible && (
          <>
            <h2 style={{ marginBottom: '20px' }}>Would you like to use an Adjacency List or Adjacency Matrix in the backend?</h2>
            <div>
              <button style={{ fontSize: '20px', padding: '10px 20px', margin: '10px', marginBottom: '10px' }} onClick={() => { setDataStructure('list'); setSearchBarVisible(true); }}>
                Use Adjacency List
              </button>
              <button style={{ fontSize: '20px', padding: '10px 20px', margin: '10px', marginBottom: '10px' }} onClick={() => { setDataStructure('matrix'); setSearchBarVisible(true); }}>
                Use Adjacency Matrix
              </button>
            </div>
          </>
        )}
        {searchBarVisible && (
          <>
          <h2 style={{ marginBottom: '20px' }}>Enter a congress member:</h2>
          <input
            id="search-bar"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                // search functionality trigger
                handleSearch(); 
              }
            }}
            style={{
              fontSize: '20px',
              padding: '10px',
              borderRadius: '20px',
              marginBottom: '20px',
              textAlign: 'center',
              width: '50%',
            }}
          />
          <br />
          {queryTime && (
            <p style={{ fontSize: '16px', marginTop: '10px' }}>Query Time: {queryTime} ms</p>
          )}
          <button onClick={handleSearch} style={{ fontSize: '20px', padding: '10px 20px', margin: '10px', marginBottom: '20px' }}>
            Search
          </button>
        </>
      )}

      </div>

      {error && <p>{error}</p>}
      {congressMember && (
        <h2 style={{ marginLeft: '20px', marginBottom: '20px' }}>List of Stock Trades for {congressMember}</h2>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginLeft: '20px',
          marginRight: '20px',
        }}
      >
        {Object.keys(trades).map((ticker) => (
          <div
            key={`${ticker}-${visibleTrades[ticker]}`}
            style={{
              position: 'relative',
              marginBottom: '20px',
            }}
          >
            <button
              id={`button-${ticker}`}
              onClick={() => toggleTradeVisibility(ticker)}
              style={{
                width: '100%',
                height: '60px',
                fontSize: '16px',
                borderRadius: '5px',
                //background: getButtonColor(ticker),
                border: 'none',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#d9d9d9';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f7f7f7';
              }}
            >
              {ticker} | Estimated Volume: ${calculateTotalVolume(trades[ticker])}
            </button>
            {visibleTrades[ticker] && (
              <div
                ref={expandedRef}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 5px)',
                  left: '0',
                  right: '0',
                  background: '#ffffff',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
                  padding: '15px',
                  borderRadius: '5px',
                  zIndex: '10',
                }}
              >
                {trades[ticker]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((trade, idx) => (
                    <div
                      key={idx}
                      style={{ background: '#f7f7f7', margin: '5px 0', padding: '10px', borderRadius: '5px' }}
                    >
                      <div>
                        {trade.date} | {trade.trade_type === "sale_partial" || trade.trade_type === "sale_full" || trade.trade_type === "sale" ? "Sale" : "Purchase"} | 
                        {trade.amount_str.startsWith("Lessthan") ? " Less than " + "$" + trade.amount_str.substring("Less than".length) : " " + trade.amount_str}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CongressTrades;
