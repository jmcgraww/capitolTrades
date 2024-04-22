import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';       // Home page component
import About from './components/pages/About';     // About page component
import NavBar from './components/NavBar';          // Navigation bar component
import Search from './components/pages/CongressTrades'; // Search page component

// Define the App component that sets up the router and routes
const App = () => {
  return (
    <Router>
      <div className="App">
        <header>
          {/* NavBar component renders the navigation bar across all pages */}
          <NavBar />
        </header>
        {/* Routes define the path and corresponding component to render */}
        <Routes>
          <Route path="/" element={<Home />} />          // Route for the Home page
          <Route path="/about" element={<About />} />    // Route for the About page
          <Route path="/search" element={<Search />} />  // Route for the Search page
        </Routes>
      </div>
    </Router>
  );
};

// export the App component for use in index.js
export default App;
