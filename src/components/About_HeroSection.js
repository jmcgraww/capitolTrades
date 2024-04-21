import React from 'react';
import '../App.css';
import './About_HeroSection.css';
import aboutStockVideo from '../videos/aboutStock.mp4';

function About_HeroSection() {
  return (
    <div className='about_hero-container'>
      <video src={aboutStockVideo} autoPlay loop muted /> 
      <h1>Who We Are</h1>
      <div className="mission-box">
        <h2>Our Mission</h2>
        <p>What Capitol Trades does is empower everyday 
          people with the transparency and insights they 
          need to understand the stock trading activities 
          of their congressional representatives. By 
          creating an accessible and user-friendly platform, 
          we aim to bridge the gap between the public and 
          the financial decisions made by those in power. 
          Simply enter a congress member's name, and uncover the stock 
          transactions that could influence policy and governance. 
          Our commitment is to foster an informed community, equipped to advocate for 
          accountability and ethical conduct in our leaders' financial dealings. Search today!</p>
      </div>
    </div>
  );
}

export default About_HeroSection;

