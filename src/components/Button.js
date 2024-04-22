import React from 'react'
import "./Button.css" // Style sheet for custom button appearances
import { Link } from 'react-router-dom' // Component for wrapping the button in a navigation link

// Define button styles and sizes arrays
const STYLES = ['btn--primary','btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

// Button component accepting props for customization and functionality
export const Button = ({
    children, // The content inside the button
    type, // The type of button
    onClick, // Function to call on button click
    buttonStyle, // The predefined styles for the button
    buttonSize, // The predefined sizes for the button
    path // The router path to which the button links
}) => {
    // Check and apply button style, defaulting to first style if not specified
    const checkButtonStyle = STYLES.includes(buttonStyle) 
    ? buttonStyle 
    : STYLES[0];

    // Check and apply button size, defaulting to first size if not specified
    const checkButtonSize = SIZES.includes(buttonSize) 
    ? buttonSize 
    : SIZES[0];

    // Render the button as a Link element
    return(
        <Link to={path} className='btn-mobile'>
            <button
            className={`btn ${checkButtonStyle} ${checkButtonSize}`}
            onClick={onClick}
            type={type}
            >
                {children} 
            </button>
        </Link>
    )
};
