import React from 'react';
import '../App.css'; // Main stylesheet for overall app styling
import './About_HeroSection.css'; // Specific styles for the About Hero section
import aboutStockVideo from '../videos/aboutStock.mp4'; // Video asset for the hero section

// Functional component for the About page's hero section
function About_HeroSection() {
  return (
    <div className='about_hero-container'>
      {/* Background video that plays automatically, loops, and is muted */}
      <video src={aboutStockVideo} autoPlay loop muted /> 
      
      {/* Main heading indicating the section's purpose */}
      <h1>Who We Are</h1>
      
      {/* Container for the mission statement */}
      <div className="mission-box">
        <h2>Our Mission</h2>
        <p>
          What Capitol Trades does is empower everyday people with the transparency and insights they 
          need to understand the stock trading activities of their congressional representatives. By 
          creating an accessible and user-friendly platform, we aim to bridge the gap between the public and 
          the financial decisions made by those in power. Simply enter a congress member's name, and uncover the stock 
          transactions that could influence policy and governance. Our commitment is to foster an informed community, equipped to advocate for 
          accountability and ethical conduct in our leaders' financial dealings. Search today!
        </p>
      </div>
    </div>
  );
}

// export the component for use in other parts of the application
export default About_HeroSection;
