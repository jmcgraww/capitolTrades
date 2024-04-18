import React, { useState } from 'react';
import axios from 'axios';

const CongressTrades = () => {
  const [inputValue, setInputValue] = useState('');
  const [congressMember, setCongressMember] = useState('');
  const [trades, setTrades] = useState([]);
  const [visibleTrades, setVisibleTrades] = useState({});
  const [error, setError] = useState('');
  const [dataStructure, setDataStructure] = useState(null);  // State to track the chosen data structure

  const handleSearch = async () => {
    console.log('Initiating search for:', inputValue);
    try {
      const response = await axios.get('/search', {
        params: { term: inputValue, data_structure: dataStructure }  // Pass chosen data structure
      });
      console.log('Search results:', response.data);
      if (response.data.length > 0) {
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
        params: { data_structure: dataStructure }  // Pass chosen data structure
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
    setVisibleTrades(prevVisibleTrades => ({
      ...prevVisibleTrades,
      [ticker]: !prevVisibleTrades[ticker]
    }));
  };

  // Render buttons for user to select the data structure type
  return (
    <div>
      <h1>Capitol Trades</h1>
      {!dataStructure && (
        <div>
          <button onClick={() => setDataStructure('list')}>Use Adjacency List</button>
          <button onClick={() => setDataStructure('matrix')}>Use Adjacency Matrix</button>
        </div>
      )}
      {dataStructure && (
        <>
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
                  {visibleTrades[ticker] && (
                    <div>
                      {tradeDetails.length > 0 && (
                        <strong>{tradeDetails[0].name}</strong>
                      )}
                      <ul>
                        {tradeDetails.map((trade, idx) => (
                          <li key={idx}>
                            <div>
                                Date: {trade.date} | 
                                Type: {trade.trade_type ? trade.trade_type.toUpperCase() : "N/A"} | 
                                Amount: {trade.amount}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CongressTrades;
