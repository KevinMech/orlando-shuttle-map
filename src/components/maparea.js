import React from 'react';
import '../App.css';
import Map from './map.js';
import MapFilter from './mapfilter.js';

const MapArea = (props) => {
	return(
		<div className='Map-area'>
            	<MapFilter/>
            	<Map center={[-81.37923649999999, 28.5383355]} zoom={15} busstops={props.busstops} busroutes={props.busroutes}/>
		</div>
	);
}

export default MapArea;
