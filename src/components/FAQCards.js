import React from 'react';
import './Cards.css'; // Styles specific to cards
import CardItem from './CardItem'; // Reusable card item component
import clear from '../images/transparent.jpeg'; // Image for Transparency card
import access from '../images/access.jpeg'; // Image for Accessibility card
import agree from '../images/agree.jpeg'; // Image for CapitolTrades Explanation card

// Functional component for displaying FAQ Cards
function FAQCards() {
  return (
    <div className='cards'>
      <h1>Our Principles</h1> 
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {/* Individual card for Transparency in Trading */}
            <CardItem
              src={clear}
              text="Currently, members of Congress have almost 
              no limits on the amount of stock that they can buy or 
              sell in a day. While the data must be reported and published, 
              it is often obfuscated in an attempt to shield the identities 
              of representatives."
              label='Transparency in Trading'
            />
            {/* Individual card for Accessibility of Information */}
            <CardItem
              src={access}
              text="Lists of stocks that Congress is buying or selling should 
              be easy-to-find online for anyone who wants to see what their 
              representative is contributing towards."
              label='Accessibility of Information'
            />
            {/* Individual card explaining the importance of CapitolTrades */}
            <CardItem
              src={agree}
              text='This program is crucial for keeping our elected officials 
              in check. CapitolTrades provides essential transparency, 
              allowing citizens to monitor and react to the financial actions
              of their legislators.'
              label='Why CapitolTrades?'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

// exports the FAQCards component for use in other parts of the application
export default FAQCards;
