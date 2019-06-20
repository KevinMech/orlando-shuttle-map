import React from 'react';
import '../App.css';
import Map from './map.js';
import MapFilter from './mapfilter.js';

const MapArea = (props) => {
  return(
    <div className='Map-area'>
      <MapFilter shuttles={props.shuttles}/>
      <Map shuttles={props.shuttles} lnglat={props.lnglat} zoom={props.zoom}/>
    </div>
  );
}

export default MapArea;
