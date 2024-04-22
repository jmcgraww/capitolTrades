import React from 'react';
import './Cards.css';
import CardItem from './CardItem';
import image2 from '../images/image2.jpeg';
import govPic from '../images/govPic.jpeg';

function Cards() {
  return (
    <div className='cards'>
      <h1>Explore CapitolTrades</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {/* About CapitolTrades Card */}
            <CardItem
              src={image2}
              text='Discover how CapitolTrades helps you track Congress stock trades, understand our objectives, and utilize our resources effectively.'
              label='About Us'
              path='/about'
            />
            {/* Search by Name Card */}
            <CardItem
              src={govPic}
              text='Search for stock trades and financial disclosures by specific Congress members to monitor their market activities.'
              label='Member Search'
              path='/search'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
