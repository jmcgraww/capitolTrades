import React, { useState } from 'react';
import axios from 'axios';

  const CongressTrades = () => {
    const [inputValue, setInputValue] = useState('');
    const [congressMember, setCongressMember] = useState('');
    const [trades, setTrades] = useState([]);
    const [visibleTrades, setVisibleTrades] = useState({});
    const [error, setError] = useState('');

  const handleSearch = async () => {
    console.log('Initiating search for:', inputValue);
    try {
      const response = await axios.get('/search', {
        params: { term: inputValue }
      });
      console.log('Search results:', response.data);
      if (response.data.length > 0) {
        fetchTrades(response.data[0]);
      } else {
        setTrades([]);
        setError('Congress person not found.');
        setCongressMember('');  // Clear the displayed name if no matches
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Error fetching data. Please try again later.');
      setTrades([]);
      setCongressMember('');  // Clear the displayed name on error
    }
  };

  const fetchTrades = async (name) => {
    console.log('Fetching trades for:', name);
    try {
      const response = await axios.get(`/trades/${name}`);
      console.log('Trades fetched:', response.data);
      setTrades(response.data);
      setCongressMember(name);  // Set the displayed name here, after successful fetch
      setError('');
    } catch (error) {
      console.error('Error fetching trades:', error);
      setError('Error fetching trades. Please try again later.');
      setTrades([]);
    }
  };

  const toggleTradeVisibility = (ticker) => {
    setVisibleTrades(prevVisibleTrades => ({
      ...prevVisibleTrades,
      [ticker]: !prevVisibleTrades[ticker]
    }));
  };

  return (
    <div>
      <h1>Capitol Trades</h1>
      <p>Enter a congress member:</p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      {congressMember && <h2>List of Stock Trades for {congressMember}</h2>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {Object.keys(trades).length > 0 && (
          Object.entries(trades).map(([ticker, tradeDetails], index) => (
            <div key={ticker}>
              <button
                onClick={() => toggleTradeVisibility(ticker)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#efefef',
                  border: 'none',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                }}
                onMouseOver={(e) => { e.target.style.transform = 'scale(1.1)'; }}
                onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }}
              >
                {ticker}
              </button>
              {visibleTrades[ticker] && Array.isArray(tradeDetails) && (
                <ul>
                  {tradeDetails.map((trade, idx) => (
                    <li key={idx}>
                      Date: {trade.date}, Type: {trade.trade_type.toUpperCase()}, Amount: {trade.amount}
                    </li>
                  ))}
                </ul>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CongressTrades;
