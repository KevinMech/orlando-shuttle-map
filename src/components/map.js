import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../App.css';
import token from '../tokens.json';
import route13 from '../config/route13.json';

mapboxgl.accessToken = token.mapbox;

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
        
        map.addControl(new mapboxgl.NavigationControl());
        
        map.on('load', () =>{
            map.addSource('route13', {type: 'geojson',data: route13 });
            map.addLayer({
                'id': 'stops',
                'type': 'symbol',
                'source': 'route13',
                "layout": {
                    "icon-image": "bus-15"
                }
            });
            map.addLayer({
                'id': 'routes',
                'type': 'line',
                'source': 'route13',
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#FF0000",
                    "line-width": 2
                }
            });
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
        });

    }

    render(){
        return <div className='Map' ref={el => this.mapContainer = el}/>;
    }
}

export default Map;
