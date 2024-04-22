import React from 'react';
import '../../App.css'; // Import the main stylesheet for consistent styling across the app
import FAQCards from '../FAQCards.js'; // Component for displaying Frequently Asked Questions cards
import HeroSection from '../About_HeroSection'; // Hero section component specifically for the About page

// Define the functional component for the About page
function About() {
  return (
    <>
      <HeroSection /> // Embed the About page hero section at the top
      <FAQCards />    // Display a series of FAQ cards below the hero section
    </>
  );
}

// export the About component for use in other parts of the application
export default About;
