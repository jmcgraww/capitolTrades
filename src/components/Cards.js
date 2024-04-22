import React from 'react';
import './Cards.css'; // Styles for the card layout
import CardItem from './CardItem'; // Reusable component for displaying individual cards
import image2 from '../images/image2.jpeg'; // Image for the 'About Us' card
import govPic from '../images/govPic.jpeg'; // Image for the 'Member Search' card

// Functional component to render card-based navigation
function Cards() {
  return (
    <div className='cards'>
      <h1>Explore</h1> 
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {/* Card for about information on CapitolTrades */}
            <CardItem
              src={image2}
              text='Discover how CapitolTrades helps you track Congress stock trades, understand our objectives, and utilize our resources effectively.'
              label='About Us'
              path='/about'
            />
            {/* Card for searching Congress members' stock trades */}
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

// export the Cards component for use in other parts of the application
export default Cards;
