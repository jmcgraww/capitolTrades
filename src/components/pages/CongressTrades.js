import React, { useState } from 'react';
import axios from 'axios';

const CongressTrades = () => {
  const [inputValue, setInputValue] = useState('');  // Added to handle input field state separately
  const [congressMember, setCongressMember] = useState('');
  const [trades, setTrades] = useState([]);
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
      {congressMember && (
        <h2>List of Stock Trades for {congressMember}</h2>
      )}
      {trades.length > 0 && (
        <ul>
          {trades.map((trade, index) => (
            <li key={index}>
              Entry {index + 1}: {trade.date}, {trade.trade_type.toUpperCase()}: ({trade.ticker}): {trade.amount} | {trade.company_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CongressTrades;
