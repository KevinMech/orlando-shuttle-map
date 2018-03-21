import React from 'react';
import '../App.css';
import ReactMapBoxGl, {ZoomControl} from 'react-mapbox-gl';
import Token from '../tokens.json'

const Map = ReactMapBoxGl({
    accessToken: Token.mapbox
});

const MapBox = () => {
    return(
        <div className='Map'>
            <Map style='mapbox://styles/mapbox/streets-v10' containerStyle={{height: '800px', width: '100%'}} center={[-81.37923649999999, 28.5383355]} zoom={[11]}/>
        </div>
    );
}

export default MapBox;
