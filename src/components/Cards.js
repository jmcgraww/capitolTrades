import React from 'react';
import './Cards.css';
import CardItem from './CardItem';
import image2 from '../images/image2.jpeg';
import questionImage from '../images/question.jpeg';
import govPic from '../images/govPic.jpeg';

function Cards() {
  return (
    <div className='cards'>
      <h1>FAQS</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              /* unordered list of questions and answers */
              src={image2}
              text='Common Questions'
              label='Inquiries'
              path='/about'
            />
            <CardItem
              src={questionImage}
              text='Resources'
              label='Inquiries'
              /* unordered list of resources */
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src={govPic}
              text='Congress Member General Info'
              label='Government'
              path='/search'
            />
            <CardItem
              src={govPic}
              text='Congress Member General Info'
              label='Government'
              path='/search'
            />
            <CardItem
              src={govPic}
              text='Congress Member General Info'
              label='Government'
              path='/search'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;