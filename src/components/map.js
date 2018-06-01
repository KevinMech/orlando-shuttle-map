import React from 'react';
import '../App.css';
import ReactMapBoxGl, {ZoomControl, Layer, Feature} from 'react-mapbox-gl';
import Token from '../tokens.json';

const Map = ReactMapBoxGl({
    accessToken: Token.mapbox
});

const MapBox = (props) => {
    return(
        <div className='Map'>
            <Map style='mapbox://styles/mapbox/streets-v10' containerStyle={{height: '800px', width: '100%'}} center={[-81.37923649999999, 28.5383355]} zoom={[11]}>
                <ZoomControl/>
                    <Layer type="symbol" id="marker" layout={{ "icon-image": "bus-15" }}>
                        <Feature coordinates={props.routes[0].stops[0]}/>
                    </Layer>
            </Map>
        </div>
    );
}

export default MapBox;
