import React from 'react';
import '../App.css'
import { Button } from './Button';
import './HeroSection.css'

function HeroSection() {
  return (
    <div className='hero-container'>
      {/*<video src='/videos/finGIF.gif' autoPlay loop muted /> */ }
      <h1>WELCOME TO CAPITOLTRADES</h1>
      <p style = {{ fontStyle : 'italic'}}>Track.Trade.Transparency.</p>
      <div className='hero-btns'>
        <Button 
        path="/about"
        className ="btns" 
        buttonStyle='btn--outline'
        buttonSize='btn--large'>
          Who We Are
          </Button>
          <Button 
          path="/search" 
          className ="btns" 
          buttonStyle='btn--primary'
          buttonSize='btn--large'>
          Discover the Moves of Congress<i className='far fa-play-circle' />
          </Button>
      </div>
    </div>
  )
}

export default HeroSection;