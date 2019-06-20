import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../App.css';
import token from '../tokens.json';

mapboxgl.accessToken = token.mapbox;
let map = null;
let currentlayers = 0;

class Map extends Component{
  componentDidMount(){
    map = new mapboxgl.Map({
      container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v10',
        center: this.props.lnglat,
        zoom: this.props.zoom
    })
    .addControl(new mapboxgl.NavigationControl())
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

  
  componentDidUpdate(prevProps, prevState) {
    console.log("Update");
    // Check to see if prop is available and whether the amount of buses has changed
    if(this.props.available != null && this.props.available.length !== currentlayers)
      for (const shuttle in this.props.available) {
        if (this.props.available.hasOwnProperty(shuttle)) {
          const element = this.props.available[shuttle];
          this.addShuttleStop(element.id, element.stops);
          currentlayers++;
        }
      }
  }

  addShuttleStop(id, stops){
    console.log(`id: ${id} shuttle: ${stops} map: ${map}`)
  }

  render(){
    return <div className='Map' ref={el => this.mapContainer = el}/>
  }
}

export default Map;
