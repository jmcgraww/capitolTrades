import React from 'react';
import '../../App.css'; // Main stylesheet for global styles
import Cards from '../Cards'; // Import Cards component for displaying card-based navigation
import HeroSection from '../HeroSection'; // Import HeroSection component for showcasing main banner

// Functional component for the Home page
function Home() {
  return (
    <>
      <HeroSection /> 
      <Cards />       
    </>
  );
}

// Export Home component for use in other parts of the application
export default Home;
