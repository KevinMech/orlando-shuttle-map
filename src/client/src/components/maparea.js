import React from 'react';
import '../App.css';
import Map from './map.js';
import MapFilter from './mapfilter.js';

const MapArea = () => {
	return(
		<div className='Map-area'>
            	<MapFilter/>
            	<Map/>
		</div>
	);
}

export default MapArea;
