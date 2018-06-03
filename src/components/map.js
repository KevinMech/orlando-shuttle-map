import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../App.css';
import Token from '../tokens.json';

mapboxgl.accessToken = Token.mapbox;

class Map extends Component{
    constructor(props){
        super(props);
    }
    
    componentDidMount(){
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v10',
            center: this.props.lnglat,
            zoom: this.props.zoom
        });

        map.on('move', () =>{
            let coord = map.getCenter();
            this.setState({
                lnglat: [coord.lng, coord.lat]
            });
        });

        map.on('zoom', () =>{
            this.setState({
                zoom: map.getZoom()
            });
            console.log(this.state.zoom);
        });
    }

    render(){
        return <div className='Map' ref={el => this.mapContainer = el}/>;
    }
}

export default Map;
