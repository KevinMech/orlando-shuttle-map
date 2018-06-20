import React from 'react';
import '../App.css';
import Map from './map.js';
import MapFilter from './mapfilter.js';

const MapArea = (props) => {
	return(
		<div className='Map-area'>
            	<MapFilter/>
            	<Map lnglat={props.lnglat} zoom={props.zoom} busstops={props.busstops} busroutes={props.busroutes}/>
		</div>
	);
}

export default MapArea;
