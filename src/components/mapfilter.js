import React from 'react';
import '../App.css';

const MapFilter = (props) =>{
  return(
    <div className='Map-Filter'>
      <p>Filter</p>
        {props.shuttles.map((shuttle, index) => {
          return <div className='Filter-Item'>
            <p key = {shuttle.id}>{shuttle.name}</p>
          </div>
        })}
    </div>
  );
}

export default MapFilter;
