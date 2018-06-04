import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../App.css';
import token from '../tokens.json';
import route13 from '../config/route13.json';

mapboxgl.accessToken = token.mapbox;

class Map extends Component{
    componentDidMount(){
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v10',
            center: this.props.lnglat,
            zoom: this.props.zoom
        })
        .addControl(new mapboxgl.NavigationControl())
        .on('load', () =>{
            this.generateLayers(map);
        })
        .on('move', () =>{
            let coord = map.getCenter();
            this.setState({
                lnglat: [coord.lng, coord.lat]
            });
        })
        .on('zoom', () =>{
            this.setState({
                zoom: map.getZoom()
            });
        });
    }

    generateLayers(map){
        map.addSource('route13', {type: 'geojson',data: route13 })
        .addLayer({
                'id': 'stops',
                'type': 'symbol',
                'source': 'route13',
                "layout": {
                    "icon-image": "bus-15"
                }
        })
        .addLayer({
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
    }

    render(){
        return <div className='Map' ref={el => this.mapContainer = el}/>;
    }
}

export default Map;
