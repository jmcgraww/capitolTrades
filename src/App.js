// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import CongressTrades from './components/CongressTrades';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header>
          {/* Navigation or header */}
        </header>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/" element={<CongressTrades />} />
          {/* Other routes */}
        </Routes>
        <footer>
          {/* Footer */}
        </footer>
      </div>
    </Router>
  );
};

export default App;