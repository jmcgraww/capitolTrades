// CongressTrades.js

import React, { useState } from 'react';
import axios from 'axios';

const CongressTrades = () => {
  const [congressMember, setCongressMember] = useState('');
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json'
      );
      const data = response.data;
      const congressSet = new Set(data.map((entry) => entry.representative));

      if (!congressSet.has(congressMember)) {
        setError('Congress person not found.');
        setTrades([]);
      } else {
        const filteredTrades = data.filter(
          (entry) => entry.representative === congressMember
        );
        setTrades(filteredTrades);
        setError('');
      }
    } catch (error) {
      setError('Error fetching data. Please try again later.');
      setTrades([]);
    }
  };

  return (
    <div>
      <h1>Capitol Trades</h1>
      <p>Enter a congress member:</p>
      <input
        type="text"
        value={congressMember}
        onChange={(e) => setCongressMember(e.target.value)}
      />
      <button onClick={fetchData}>Search</button>
      {error && <p>{error}</p>}
      {trades.length > 0 && (
        <div>
          <h2>Stock Trades for {congressMember}</h2>
          <ul>
            {trades.map((entry, index) => (
              <li key={index}>
                Entry {index + 1}: {entry.disclosure_year},{' '}
                {entry.type.toUpperCase()}: ({entry.ticker}): {entry.amount} |{' '}
                {entry.party} Rep: {entry.representative}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CongressTrades;
