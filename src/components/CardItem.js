import React from 'react';
import { Link } from 'react-router-dom';

// define the CardItem functional component with props parameter
function CardItem(props) {
  return (
    <li className='cards__item'>
      {/* Link component for navigation, path is passed as a prop */}
      <Link className='cards__item__link' to={props.path}>
        {/* Image container with label indicating the category of the card */}
        <figure className='cards__item__pic-wrap' data-category={props.label}>
          {/* Display image with dynamic source and alternative text */}
          <img
            className='cards__item__img'
            alt={props.alt}
            src={props.src}
          />
        </figure>
        {/* Container for card text */}
        <div className='cards__item__info'>
          {/* Display card text, passed as a prop */}
          <h5 className='cards__item__text'>{props.text}</h5>
        </div>
      </Link>
    </li>
  );
}

// export the CardItem component for use in other parts of the application
export default CardItem;

