import React from 'react';
import '../App.css'; // General styles for the app
import { Button } from './Button'; // Custom button component for actions
import './HeroSection.css'; // Specific styles for the hero section

// Define the HeroSection functional component
function HeroSection() {
  return (
    <div className='hero-container'>
      {/* Placeholder for a background video - uncomment to activate
          <video src='/videos/finGIF.gif' autoPlay loop muted /> */}
      
      <h1>WELCOME TO CAPITOLTRADES</h1> {/* Main greeting text */}
      <p style={{ fontStyle: 'italic' }}>Track. Trade. Transparency.</p> {/* italicized tagline */}
      
      <div className='hero-btns'>
        {/* Button to navigate to the 'About' page */}
        <Button 
          path="/about"
          className="btns" 
          buttonStyle='btn--outline' // Style definition for an outlined button
          buttonSize='btn--large'> // Large button size
          Who We Are
        </Button>
        
        {/* Button to navigate to the 'Search' page */}
        <Button 
          path="/search" 
          className="btns" 
          buttonStyle='btn--primary' // Style definition for a primary button
          buttonSize='btn--large'> // Large button size
          Discover the Moves of Congress<i className='far fa-play-circle' /> // Icon indicating action
        </Button>
      </div>
    </div>
  );
}

// Export HeroSection for use in other parts of the application
export default HeroSection;
