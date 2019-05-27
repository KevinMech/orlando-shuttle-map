import React from 'react';
import '../App.css';

const MapFilter = (props) =>{
  return(
    <div className='Map-Filter'>
      <p>Filter</p>
        {props.available.map((shuttle, index) => {
          return <p key = {shuttle.id}>{shuttle.name}</p>
        })}
    </div>
  );
}

export default MapFilter;
