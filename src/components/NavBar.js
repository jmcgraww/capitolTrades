// import necessary React hooks and components
import React, { useState, useEffect } from 'react';
import { Button } from './Button'; // custom button component
import { Link } from 'react-router-dom'; // routing component for navigation
import './NavBar.css'; // styling for the navbar

// define the NavBar functional component.
function NavBar() {
  // state 'click' to handle the toggle of the mobile menu 
  const [click, setClick] = useState(false);
  // state 'button' to manage the visibility of the button based on screen size
  const [button, setButton] = useState(true);

  // toggle the 'click' state between true and false
  const handleClick = () => setClick(!click);
  // set the 'click' state to false to close the mobile menu
  const closeMobileMenu = () => setClick(false);

  // function to determine whether the button should be displayed based on screen width
  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false); // Hide button on smaller screens
    } else {
      setButton(true); // Show button on larger screens
    }
  };

  // useEffect hook to handle actions after the component mounts
  useEffect(() => {
    showButton(); // Call showButton function to check initial screen width
    // Cleanup function to remove the event listener when the component unmounts
    const handleResize = () => {
      showButton();
    };

    // Add event listener to re-check screen width upon window resize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener.
    };
  }, []); 

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            {/* Placeholder for logo - can be an image or text as required. */}
            CAPITOLTRADES
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            {/* Icon changes based on the state of 'click' to show bars (menu) or times (close). */}
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/about' className='nav-links' onClick={closeMobileMenu}>
                About
              </Link>
            </li>
            <li>
              <Link to="/search" className='nav-links-mobile' onClick={closeMobileMenu}>
                Search
              </Link>
            </li>
          </ul>
          {/* Display the button only if the 'button' state is true. */}
          {button && <Button path="/search" buttonStyle='btn--outline'>SEARCH</Button>}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
