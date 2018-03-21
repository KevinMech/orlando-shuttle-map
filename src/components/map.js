import React from 'react';
import '../App.css';
import ReactMapBoxGl from 'react-mapbox-gl';
import Token from '../tokens.json'

const Map = ReactMapBoxGl({
    accessToken: Token.mapbox
});

class MapBox extends React.Component{
    constructor(props){
        super();
    }

    DidComponentMount(){
    }

    render() {
        return(
            <div className='Map'>
                <Map style='mapbox://styles/mapbox/streets-v10' containerStyle={{height: '800px', width: '100%'}}/>
            </div>
        );
    }
}

export default MapBox;
