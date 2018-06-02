import React from 'react';
import '../App.css';
import Map from './map.js';
import MapFilter from './mapfilter.js';

const MapArea = (props) => {
	return(
		<div className='Map-area'>
            	<MapFilter/>
            	<Map busstops={props.busstops} busroutes={props.busroutes}/>
		</div>
	);
}

export default MapArea;
