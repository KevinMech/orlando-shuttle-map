import React from 'react';
import '../App.css';
import Map from './map.js';
import MapFilter from './mapfilter.js';

const MapArea = (props) => {
  return(
    <div className='Map-area'>
      <MapFilter available={props.available}/>
      <Map lnglat={props.lnglat} zoom={props.zoom}  busroutes={props.shown}/>
    </div>
  );
}

export default MapArea;
