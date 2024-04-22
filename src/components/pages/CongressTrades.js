import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CongressTrades = () => {
  const [inputValue, setInputValue] = useState('');
  const [congressMember, setCongressMember] = useState('');
  const [trades, setTrades] = useState([]);
  const [visibleTrades, setVisibleTrades] = useState({});
  const [prevVisibleTrades, setPrevVisibleTrades] = useState({});
  const [error, setError] = useState('');
  const [dataStructure, setDataStructure] = useState(null);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [queryTime, setQueryTime] = useState(null);
  const [expandedTicker, setExpandedTicker] = useState(null); // Track the currently expanded ticker
  const expandedRef = useRef(null);

  useEffect(() => {
    scrollToExpandedInfo();
  }, [visibleTrades]);

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
      console.log(response.data); // Log the response data
      setTrades(response.data);
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
    setExpandedTicker(ticker); // Update the expanded ticker
  };

  const scrollToExpandedInfo = () => {
    Object.keys(visibleTrades).forEach((ticker) => {
      // Check if trade visibility changed from false to true
      if (!prevVisibleTrades[ticker] && visibleTrades[ticker]) {
        const buttonRef = document.getElementById(`button-${ticker}`);
        if (buttonRef && expandedRef.current) {
          const searchBarRect = document.getElementById('search-bar').getBoundingClientRect();
          const buttonRect = buttonRef.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const buttonTop = buttonRect.top - searchBarRect.height - windowHeight / 10;
          // Check if the button is already above the current viewport
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

  const getLastTradeType = (ticker) => {
    const lastTrade = trades[ticker] && trades[ticker].length > 0 ? trades[ticker][0].trade_type : null;
    return lastTrade;
  };

  const getButtonColor = (ticker) => {
    const lastTradeType = getLastTradeType(ticker);
    if (lastTradeType === 'Purchase') {
      return 'green'; // Green color for purchase
    } else if (lastTradeType === 'Sale') {
      return 'red'; // Red color for sale
    } else {
      return '#efefef'; // Default color
    }
  };

  const calculateTotalVolume = (trades) => {
    console.log("Trades array:", trades); // Log the trades array
    let totalVolume = 0;
    let totalTrades = 0; // Counter for the total number of trades
    
    trades.forEach((trade) => {
      const averageAmount = (parseInt(trade.amount[0]) + parseInt(trade.amount[1])) / 2; // Calculate the average amount
      totalTrades++; // Increment the total trades counter
      totalVolume += averageAmount
    //   if (trade.trade_type === 'purchase') {
    //     totalVolume += averageAmount; // Add the average amount to total volume
    //   } else if (trade.trade_type === 'sale_full' || trade.trade_type == 'sale_partial') {
    //     totalVolume -= averageAmount; // Subtract the average amount from total volume
    //   }
    // });
    });
      
    if (totalTrades === 0) return '0'; // Handle division by zero
    
    return totalVolume.toLocaleString(); // Return the total volume as localized string
  };
  
  
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
                background: getButtonColor(ticker),
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
                e.target.style.background = getButtonColor(ticker);
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
                  .sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                  })
                  .map((trade, idx) => (
                    <li
                      key={idx}
                      style={{ background: '#f7f7f7', margin: '5px 0', padding: '10px', borderRadius: '5px' }}
                    >
                      <div>
                        Date: {trade.date} | Type: {trade.trade_type} | {String(trade.amount.amount)}
                      </div>
                    </li>
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
