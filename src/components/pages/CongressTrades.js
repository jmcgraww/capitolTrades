import React, { useState } from 'react';
import axios from 'axios';

const CongressTrades = () => {
  const [inputValue, setInputValue] = useState('');
  const [congressMember, setCongressMember] = useState('');
  const [trades, setTrades] = useState([]);
  const [visibleTrades, setVisibleTrades] = useState({});
  const [error, setError] = useState('');
  const [dataStructure, setDataStructure] = useState(null); // State to track the chosen data structure
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [queryTime, setQueryTime] = useState(null);

  const handleSearch = async () => {
    console.log('Initiating search for:', inputValue);
    try {
      const startTime = Date.now(); // Record start time
      const response = await axios.get('/search', {
        params: { term: inputValue, data_structure: dataStructure }, // Pass chosen data structure
      });
      const endTime = Date.now(); // Record end time
      const timeElapsed = endTime - startTime; // Calculate time taken for the query
      console.log('Search results:', response.data);
      setQueryTime(timeElapsed); // Set query time
      if (response.data.length > 0) {
        setSearchBarVisible(true);
        fetchTrades(response.data[0]);
      } else {
        setTrades([]);
        setError('Congress person not found.');
        setCongressMember('');
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Error fetching data. Please try again later.');
      setTrades([]);
      setCongressMember('');
    }
  };

  const fetchTrades = async (name) => {
    console.log('Fetching trades for:', name);
    try {
      const response = await axios.get(`/trades/${name}`, {
        params: { data_structure: dataStructure }, // Pass chosen data structure
      });
      console.log('Trades fetched:', response.data);
      setTrades(response.data);
      setCongressMember(name);
      setError('');
    } catch (error) {
      console.error('Error fetching trades:', error);
      setError('Error fetching trades. Please try again later.');
      setTrades([]);
    }
  };

  const toggleTradeVisibility = (ticker) => {
    setVisibleTrades((prevVisibleTrades) => {
      const newVisibleTrades = {
        ...prevVisibleTrades,
        [ticker]: !prevVisibleTrades[ticker],
      };
      console.log('Visibility Toggled for:', ticker, newVisibleTrades[ticker]);
      return newVisibleTrades;
    });
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Capitol Trades</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {!searchBarVisible && (
          <>
            <h2 style={{ marginBottom: '20px' }}>Would you like to use an Adjacency List or Adjacency Matrix in the backend?</h2>
            <div>
            <button style={{ fontSize: '20px', padding: '10px 20px', margin: '10px' }} onClick={() => { setDataStructure('list'); setSearchBarVisible(true); }}>
              Use Adjacency List
            </button>
            <button style={{ fontSize: '20px', padding: '10px 20px', margin: '10px' }} onClick={() => { setDataStructure('matrix'); setSearchBarVisible(true); }}>
              Use Adjacency Matrix
            </button>

            </div>
          </>
        )}
        {searchBarVisible && (
          <>
            <h2 style={{ marginBottom: '20px' }}>Enter a congress member:</h2>
            <input
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
            <button onClick={handleSearch} style={{ fontSize: '20px', padding: '10px 20px', margin: '10px' }}>
              Search
            </button>
            {queryTime && (
              <p style={{ fontSize: '16px', marginTop: '10px' }}>Query Time: {queryTime} ms</p>
            )}
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
          gridTemplateColumns: 'repeat(3, 1fr)', // Adjusted minmax width
          gap: '20px',
          marginLeft: '20px',
          marginRight: '20px',
        }}
      >
        {Object.keys(trades).length > 0 &&
          Object.entries(trades).map(([ticker, tradeDetails], index) => (
            <div
              key={`${ticker}-${visibleTrades[ticker]}`}
              style={{
                position: 'relative',
                overflow: 'visible',
              }}
            >
              <button
                onClick={() => toggleTradeVisibility(ticker)}
                style={{
                  width: '100%', // Adjusted width
                  height: '60px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  background: '#efefef',
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
                  e.target.style.background = '#efefef';
                }}
              >
                {ticker}
              </button>
              {visibleTrades[ticker] && (
                <div
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
                  {tradeDetails.length > 0 && (
                    <strong>{tradeDetails[0].name.slice(0, 20)}</strong>
                  )}
                  <ul>
                    {tradeDetails.map((trade, idx) => (
                      <li
                        key={idx}
                        style={{ background: '#f7f7f7', margin: '5px 0', padding: '10px', borderRadius: '5px' }}
                      >
                        <div>
                          Date: {trade.date} | Type: {trade.trade_type} | {trade.amount.toLocaleString()}
                          {/* Formatting number with commas */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CongressTrades;
