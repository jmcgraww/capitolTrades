import React, { useState, useEffect } from 'react';
import { Button } from './Button'; // Import custom button component
import { Link } from 'react-router-dom'; // Import Link for navigation
import './NavBar.css'; // Import navbar styles

// Define the NavBar functional component
function NavBar() {
  // State 'click' to handle the toggle of the mobile menu
  const [click, setClick] = useState(false);
  // State 'button' to manage the visibility of the button based on screen size
  const [button, setButton] = useState(true);

  // Toggle the 'click' state between true and false
  const handleClick = () => setClick(!click);
  // Set the 'click' state to false to close the mobile menu
  const closeMobileMenu = () => setClick(false);

  // Determine whether the button should be displayed based on screen width
  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false); // Hide button on smaller screens
    } else {
      setButton(true); // Show button on larger screens
    }
  };

  // Add and clean up the resize event listener
  useEffect(() => {
    showButton(); // Initial screen width check
    const handleResize = () => showButton();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array means this effect runs only on mount and unmount

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            CAPITOLTRADES {/* Logo text or image */}
          </Link>
          <div className='menu-icon' onClick={handleClick}>
          {/* Toggle menu icon */}
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <Link to='/' className='nav-links' onClick={closeMobileMenu}>Home</Link>
          </li>
          <li className='nav-item'>
            <Link to='/about' className='nav-links' onClick={closeMobileMenu}>About</Link>
          </li>
        </ul>
        {button && <Button path="/search" buttonStyle='btn--outline'>SEARCH</Button>}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
