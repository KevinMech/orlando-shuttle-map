import React from 'react';
import '../App.css';
import Map from './map.js';
import MapFilter from './mapfilter.js';

const MapArea = (props) => {
	return(
		<div className='Map-area'>
            	<MapFilter/>
            	<Map routes={props.routes}/>
		</div>
	);
}

export default MapArea;
